from .models import (
    Configuration,
    InputPage,
    OutputPage,
    InputValue,
    OutputValue,
    ImageModel,
)
from django.db import connection
from django.conf import settings
import json
import sympy
import re
import os
from django.forms.models import model_to_dict


def delete_all_images_and_static():
    all_images = ImageModel.objects.all()

    for image_instance in all_images:
        file_url = image_instance.image

        if file_url:
            file_name = file_url.replace("http://localhost:8000/api/images/", "")

            file_path = os.path.join(settings.MEDIA_ROOT, file_name)

            os.remove(file_path)

            image_instance.delete()


def reset_autoincrement(table_name):
    with connection.cursor() as cursor:
        cursor.execute(f"DELETE FROM sqlite_sequence WHERE name='{table_name}'")


def create_or_update_configuration(
    input_pages_data,
    output_page_data,
    formula_list,
    configuration_id=None,
    image_files=None,
    image_index_array=None,
):
    last_index = len(image_files) - 1

    output_data = json.loads(output_page_data)
    inputs_data = json.loads(input_pages_data)

    result = {
        "outputPage": {
            "title": output_data["title"],
            "description": output_data["description"],
            "image": output_data["image"],
            "outputValues": output_data.get("outputValues", []),
            "outputUnit": output_data["outputUnit"],
        },
        "inputPages": [],
        "formulaList": json.loads(formula_list),
    }

    try:
        if configuration_id:
            cleaned_image_index_array = [
                index for index in image_index_array if index != "undefined"
            ]
            configuration_obj = Configuration.objects.get(id=configuration_id)

            for array_index, image_index in enumerate(cleaned_image_index_array):
                file = image_files[array_index]
                if file:
                    if image_index == "outputImage":
                        last_file = image_files[array_index]
                        last_file_name = last_file.name
                        last_file_path = os.path.join(
                            settings.MEDIA_ROOT, last_file_name
                        )

                        with open(last_file_path, "wb+") as destination:
                            for chunk in last_file.chunks():
                                destination.write(chunk)

                        root_directory = "/Users/Burak/Documents/GitHub/calculation-tool-app/django-backend"
                        relative_path = os.path.relpath(last_file_path, root_directory)

                        configuration_obj.output_page.image.image = (
                            "http://localhost:8000/api/" + relative_path
                        )
                        configuration_obj.output_page.image.save()
                    else:
                        input_page_index = int(image_index.split(" ")[1])
                        input_file = image_files[array_index]
                        input_file_name = input_file.name
                        input_file_path = os.path.join(
                            settings.MEDIA_ROOT, input_file_name
                        )

                        with open(input_file_path, "wb+") as destination:
                            for chunk in input_file.chunks():
                                destination.write(chunk)

                        root_directory = "/Users/Burak/Documents/GitHub/calculation-tool-app/django-backend"
                        relative_path = os.path.relpath(input_file_path, root_directory)

                        inputs_data[input_page_index]["image"] = (
                            "http://localhost:8000/api/" + relative_path
                        )

            configuration_obj.output_page.title = output_data["title"]
            configuration_obj.output_page.description = output_data["description"]
            configuration_obj.output_page.output_unit = output_data["outputUnit"]
            configuration_obj.output_page.save()

            configuration_obj.formula_list_json = formula_list
            configuration_obj.save()

            for output_value_data in output_data.get("outputValues", []):
                try:
                    if not "id" in output_value_data:
                        output_value_obj = OutputValue(
                            placeholder=output_value_data["placeholder"],
                            variable=output_value_data["variable"],
                        )
                        output_value_obj.save()
                        configuration_obj.output_page.output_values.add(
                            output_value_obj
                        )

                    else:
                        output_value_obj = OutputValue.objects.get(
                            id=output_value_data["id"]
                        )
                        output_value_obj.placeholder = output_value_data["placeholder"]
                        output_value_obj.variable = output_value_data["variable"]
                        output_value_obj.save()
                except OutputValue.DoesNotExist:
                    pass
            index = 0
            for input_page_data in inputs_data:
                try:
                    if not "id" in input_page_data:
                        input_page_image = ImageModel(
                            image=input_page_data["image"],
                            index=index,
                        )
                        input_page_image.save()

                        input_page_obj = InputPage(
                            title=input_page_data["title"],
                            description=input_page_data["description"],
                            image=input_page_image,
                        )
                        input_page_obj.save()
                        input_values_list = []

                        for input_value_data in input_page_data.get("inputValues", []):
                            input_value_obj = InputValue(
                                placeholder=input_value_data["placeholder"],
                                variable=input_value_data["variable"],
                            )

                        input_values_list.append(
                            {
                                "id": input_value_obj.id,
                                "placeholder": input_value_obj.placeholder,
                                "variable": input_value_obj.variable,
                            }
                        )

                        configuration_obj.input_pages.add(input_page_obj)
                        configuration_obj.save()

                    else:
                        input_page_obj = InputPage.objects.get(id=input_page_data["id"])
                        input_page_obj.title = input_page_data["title"]
                        input_page_obj.description = input_page_data["description"]
                        input_page_obj.save()
                        if input_page_obj.image_id:
                            input_page_obj.image.image = input_page_data["image"]
                            input_page_obj.image.save()

                    for input_value_data in input_page_data.get("inputValues", []):
                        if not "id" in input_value_data:
                            input_value_obj = InputValue(
                                placeholder=input_value_data["placeholder"],
                                variable=input_value_data["variable"],
                            )
                            input_value_obj.save()
                            input_page_obj.input_values.add(input_value_obj)
                        else:
                            input_value_obj = InputValue.objects.get(
                                id=input_value_data["id"]
                            )
                            input_value_obj.placeholder = input_value_data[
                                "placeholder"
                            ]
                            input_value_obj.variable = input_value_data["variable"]
                            input_value_obj.save()
                            index += 1

                except InputPage.DoesNotExist:
                    pass

            result["configurationId"] = configuration_obj.id
            output_values_list = []

            for output_value_data in output_data.get("outputValues", []):
                try:
                    if "id" in output_value_data:
                        output_value_obj = OutputValue.objects.get(
                            id=output_value_data["id"]
                        )
                        output_values_list.append(
                            {
                                "id": output_value_obj.id,
                                "placeholder": output_value_obj.placeholder,
                                "variable": output_value_obj.variable,
                            }
                        )

                except OutputValue.DoesNotExist:
                    pass
            result["outputPage"]["outputValues"] = output_values_list

            for input_page_data in inputs_data:
                try:
                    if "id" in input_page_data:
                        input_page_obj = InputPage.objects.get(id=input_page_data["id"])
                        input_values_list = []

                        for input_value_data in input_page_data.get("inputValues", []):
                            try:
                                if "id" in input_value_data:
                                    input_value_obj = InputValue.objects.get(
                                        id=input_value_data["id"]
                                    )
                                    input_values_list.append(
                                        {
                                            "id": input_value_obj.id,
                                            "placeholder": input_value_obj.placeholder,
                                            "variable": input_value_obj.variable,
                                        }
                                    )

                            except InputValue.DoesNotExist:
                                pass
                        result["inputPages"].append(
                            {
                                "title": input_page_obj.title,
                                "description": input_page_obj.description,
                                "image": input_page_obj.image.image,
                                "inputValues": input_values_list,
                            }
                        )

                except InputPage.DoesNotExist:
                    pass

        else:
            last_file = image_files[last_index]
            last_file_name = last_file.name
            last_file_path = os.path.join(settings.MEDIA_ROOT, last_file_name)

            with open(last_file_path, "wb+") as destination:
                for chunk in last_file.chunks():
                    destination.write(chunk)

            root_directory = (
                "/Users/Burak/Documents/GitHub/calculation-tool-app/django-backend"
            )
            relative_path = os.path.relpath(last_file_path, root_directory)

            result["outputPage"]["image"]["image"] = (
                "http://localhost:8000/api/" + relative_path
            )
            output_page_image = ImageModel(
                image=result["outputPage"]["image"]["image"],
                index=result["outputPage"]["image"]["index"],
            )
            output_page_image.save()

            output_page_obj = OutputPage(
                title=output_data["title"],
                description=output_data["description"],
                output_unit=output_data["outputUnit"],
                image=output_page_image,
            )
            output_page_obj.save()

            for output_value_data in output_data.get("outputValues", []):
                output_value_obj = OutputValue(
                    placeholder=output_value_data["placeholder"],
                    variable=output_value_data["variable"],
                )

                output_value_obj.save()
                output_page_obj.output_values.add(output_value_obj)

            configuration_obj = Configuration(
                output_page=output_page_obj, formula_list_json=formula_list
            )
            configuration_obj.save()
            result["configurationId"] = configuration_obj.id

            index = 0
            for input_data in inputs_data:
                image_file = image_files[index]
                image_file_name = image_file.name
                image_file_path = os.path.join(settings.MEDIA_ROOT, image_file_name)

                with open(image_file_path, "wb+") as destination:
                    for chunk in image_file.chunks():
                        destination.write(chunk)

                root_directory = (
                    "/Users/Burak/Documents/GitHub/calculation-tool-app/django-backend"
                )
                relative_path = os.path.relpath(image_file_path, root_directory)
                input_page_image_json = {
                    "image": "http://localhost:8000/api/" + relative_path,
                    "index": index,
                }

                input_page_image = ImageModel(
                    image=input_page_image_json["image"],
                    index=input_page_image_json["index"],
                )
                input_page_image.save()

                input_page_obj = InputPage(
                    title=input_data["title"],
                    description=input_data["description"],
                    image=input_page_image,
                )
                input_page_obj.save()

                input_values_list = []

                for input_value_data in input_data.get("inputValues", []):
                    input_value_obj = InputValue(
                        placeholder=input_value_data["placeholder"],
                        variable=input_value_data["variable"],
                    )
                    input_value_obj.save()
                    input_page_obj.input_values.add(input_value_obj)
                    input_values_list.append(
                        {
                            "id": input_value_obj.id,
                            "placeholder": input_value_obj.placeholder,
                            "variable": input_value_obj.variable,
                        }
                    )

                configuration_obj.input_pages.add(input_page_obj)
                configuration_obj.save()

                result["inputPages"].append(
                    {
                        "id": input_page_obj.id,
                        "title": input_page_obj.title,
                        "description": input_page_obj.description,
                        "image": input_page_image_json,
                        "inputValues": input_values_list,
                    }
                )
                index += 1

    except Exception as e:
        result["error"] = str(e)

    return result


def delete_configuration():
    try:
        input_values = InputValue.objects.all()
        for input_value in input_values:
            input_value.delete()

        output_values = OutputValue.objects.all()
        for output_value in output_values:
            output_value.delete()

        input_pages = InputPage.objects.all()
        for input_page in input_pages:
            for input_value in input_page.input_values.all():
                input_value.delete()
            input_page.delete()

        output_pages = OutputPage.objects.all()
        for output_page in output_pages:
            for output_value in output_page.output_values.all():
                output_value.delete()
            output_page.delete()

        configurations = Configuration.objects.all()
        for configuration_obj in configurations:
            configuration_obj.delete()

        delete_all_images_and_static()

        reset_autoincrement("calc_tool_configuration_input_pages")
        reset_autoincrement("calc_tool_configuration")
        reset_autoincrement("calc_tool_inputpage_input_values")
        reset_autoincrement("calc_tool_outputpage_output_values")
        reset_autoincrement("calc_tool_outputpage")
        reset_autoincrement("calc_tool_inputpage")
        reset_autoincrement("calc_tool_configuration")
        reset_autoincrement("calc_tool_outputvalue")
        reset_autoincrement("calc_tool_inputvalue")
        reset_autoincrement("calc_tool_imagemodel")
        reset_autoincrement("calc_tool_customer")

    except Exception as e:
        return {"error": str(e)}

    return {"success": True}


def delete_input_value(input_value_id):
    try:
        input_value = InputValue.objects.get(pk=input_value_id)
        input_value.delete()
        return {"success": True}
    except InputValue.DoesNotExist:
        return {"success": False, "error": "InputValue cannot be found"}
    except Exception as e:
        return {"success": False, "error": str(e)}


def delete_input_page(input_page_id):
    try:
        input_page = InputPage.objects.get(pk=input_page_id)
        input_page.input_values.clear()
        input_page.delete()
        return {"success": True}
    except InputPage.DoesNotExist:
        return {"success": False, "error": "InputPage cannot be found"}
    except Exception as e:
        return {"success": False, "error": str(e)}


def delete_output_value(output_value_id):
    try:
        output_value = OutputValue.objects.get(pk=output_value_id)
        output_value.delete()
        return {"success": True}
    except OutputValue.DoesNotExist:
        return {"success": False, "error": "OutputValue cannot be found"}
    except Exception as e:
        return {"success": False, "error": str(e)}


def get_configurations():
    try:
        configurations = Configuration.objects.all()
        serialized_configurations = []

        for configuration in configurations:
            formula_list_str = configuration.formula_list_json.replace("'", '"')
            formula_list = json.loads(formula_list_str)
            serialized_configuration = {
                "configurationId": configuration.id,
                "outputPage": {
                    "id": configuration.output_page.id,
                    "title": configuration.output_page.title,
                    "description": configuration.output_page.description,
                    "image": configuration.output_page.image.image,
                    "outputValues": [],
                    "outputUnit": configuration.output_page.output_unit,
                },
                "inputPages": [],
                "formulaList": formula_list,
            }

            for output_value in configuration.output_page.output_values.all():
                serialized_output_value = {
                    "id": output_value.id,
                    "placeholder": output_value.placeholder,
                    "variable": output_value.variable,
                }
                serialized_configuration["outputPage"]["outputValues"].append(
                    serialized_output_value
                )

            for input_page in configuration.input_pages.all():
                serialized_input_page = {
                    "id": input_page.id,
                    "title": input_page.title,
                    "description": input_page.description,
                    "image": input_page.image.image,
                    "inputValues": [],
                }
                for input_value in input_page.input_values.all():
                    serialized_input_value = {
                        "id": input_value.id,
                        "placeholder": input_value.placeholder,
                        "variable": input_value.variable,
                    }
                    serialized_input_page["inputValues"].append(serialized_input_value)
                serialized_configuration["inputPages"].append(serialized_input_page)

            serialized_configurations.append(serialized_configuration)

        if serialized_configurations:
            return serialized_configurations[0]
        else:
            return serialized_configurations

    except Exception as e:
        return {"error": str(e)}


def perform_calculations(formula_list, input_values):
    results = {}
    evaluated_values = {}

    lower_case_formula_list = [formula.lower() for formula in formula_list]
    lower_case_input_values = {
        key.lower(): value for key, value in input_values.items()
    }

    for key in lower_case_input_values:
        input_formula = lower_case_input_values[key]
        try:
            input_result = sympy.sympify(input_formula, evaluated_values)
            evaluated_values[key] = float(input_result)
        except Exception as error:
            print(error)
            evaluated_values[key] = "Calculation Error"

    for formula in lower_case_formula_list:
        formula_key, formula_expression = map(str.strip, formula.split("="))
        try:
            modified_formula = re.sub(
                r"\b([A-Za-z_][A-Za-z_0-9]*)\b",
                lambda match: str(evaluated_values[match.group(0)])
                if evaluated_values.get(match.group(0))
                else match.group(0),
                formula_expression,
            )

            formula_result = sympy.sympify(modified_formula, evaluated_values)
            evaluated_values[formula_key] = float(formula_result)
            results[formula_key] = float(formula_result)
        except Exception as error:
            print(error)
            results[formula_key] = "Calculation Error"

    return results
