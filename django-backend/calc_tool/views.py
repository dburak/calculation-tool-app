from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import UserModel
from .models import Customer
from django.contrib.auth.hashers import check_password
import jwt
from django.core.files.uploadedfile import UploadedFile
from .services import (
    create_or_update_configuration,
    delete_configuration,
    get_configurations,
    perform_calculations,
    delete_input_value,
    delete_input_page,
    delete_output_value,
)
import os
from django.conf import settings


# from project.settings import SECRET_KEY


class UserApiView(APIView):
    def get(self, request):
        queryset = UserModel.objects.all()
        serialized_data = [
            {"name": user.name, "email": user.email} for user in queryset
        ]
        return Response(data=serialized_data, status=status.HTTP_200_OK)

    def post(self, request):
        name = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        new_user = UserModel(name=name, email=email, password=password)
        new_user.save()

        return Response(
            {"message": "new user created."}, status=status.HTTP_201_CREATED
        )


class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        try:
            user = UserModel.objects.get(email=email)

        except UserModel.DoesNotExist:
            return Response({"error": "User not found"}, status=401)

        if not check_password(password, user.password):
            return Response({"error": "Invalid password"}, status=401)

        payload = {
            "email": user.email,
            "id": user.id,
        }
        token = jwt.encode(payload, "super_secret", algorithm="HS256")

        user_data = {
            "name": user.name,
            "email": user.email,
            "id": user.id,
        }

        response_data = {
            "token": token,
            "user": user_data,
        }

        return Response(response_data)


class ConfigurationView(APIView):
    def put(self, request, format=None):
        input_pages_data = request.data.get("inputPages")
        output_page_data = request.data.get("outputPage")
        formula_list = request.data.get("formulaList")

        configuration_id = request.data.get("configurationId", None)

        image_index_array = request.data.getlist("imageIndexArray")

        image_files = request.FILES.getlist("image")

        configuration_result = create_or_update_configuration(
            input_pages_data,
            output_page_data,
            formula_list,
            configuration_id,
            image_files,
            image_index_array,
        )

        if "error" in configuration_result:
            return Response(
                {"error": configuration_result["error"]},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        else:
            return Response(
                configuration_result,
                status=status.HTTP_201_CREATED,
            )

    def delete(
        self,
        request,
        input_value_id=None,
        input_page_id=None,
        output_value_id=None,
        format=None,
    ):
        if input_value_id is None and input_page_id is None and output_value_id is None:
            delete_result = delete_configuration()
        elif input_value_id:
            delete_result = delete_input_value(input_value_id)
        elif output_value_id:
            delete_result = delete_output_value(output_value_id)
        else:
            delete_result = delete_input_page(input_page_id)

        if "error" in delete_result:
            return Response(
                {"error": delete_result["error"]},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        else:
            return Response(
                {"message": "Deleted successfully"},
                status=status.HTTP_204_NO_CONTENT,
            )

    def get(self, request, format=None):
        try:
            serialized_configurations = get_configurations()
            if not serialized_configurations:
                return Response(status=status.HTTP_200_OK, data=None)
            return Response(serialized_configurations, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class CalculationView(APIView):
    def post(self, request):
        formula_list = request.data.get("formulaList")
        input_values = request.data.get("inputValues")

        try:
            results = perform_calculations(formula_list, input_values)

            for key, value in results.items():
                if value == "Calculation Error":
                    results = None
                    break

            if results is not None:
                return Response(results, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "Internal Server Error"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        except Exception as e:
            print(e)
            return Response(
                {"error": "Internal Server Error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class CustomerView(APIView):
    def get(self, request):
        customers = Customer.objects.all()
        serialized_data = [
            {
                "id": customer.id,
                "name": customer.name,
                "surname": customer.surname,
                "phoneNumber": customer.phone_number,
            }
            for customer in customers
        ]
        return Response(serialized_data, status=status.HTTP_200_OK)

    def post(self, request):
        name = request.data.get("name")
        surname = request.data.get("surname")
        phone_number = request.data.get("phoneNumber")

        print(name)

        if name and surname and phone_number:
            customer = Customer(name=name, surname=surname, phone_number=phone_number)
            customer.save()
            response_data = {
                "id": customer.id,
                "name": customer.name,
                "surname": customer.surname,
                "phoneNumber": customer.phone_number,
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        customer_ids = request.data

        try:
            deleted_customers = Customer.objects.filter(id__in=customer_ids).delete()
            number_of_deleted_customer = deleted_customers[0]

            return Response(
                {"message": f"{number_of_deleted_customer} customer(s) deleted."},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
