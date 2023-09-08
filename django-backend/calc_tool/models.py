from django.db import models
from django.contrib.auth.hashers import make_password
import json


# USER
class UserModel(models.Model):
    email = models.CharField(max_length=255, unique=True, default="")
    name = models.CharField(max_length=255, default="")
    password = models.CharField(max_length=128, default="")

    def save(self):
        self.password = make_password(self.password)
        return super().save()

    class Meta:
        db_table = "user"


# CONFIGURATIONS
class ImageModel(models.Model):
    image = models.CharField(max_length=300)
    index = models.CharField(max_length=50)


class InputValue(models.Model):
    placeholder = models.CharField(max_length=100)
    variable = models.CharField(max_length=100)


class InputPage(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ForeignKey(
        ImageModel,
        on_delete=models.CASCADE,
    )
    input_values = models.ManyToManyField(InputValue)


class OutputValue(models.Model):
    placeholder = models.CharField(max_length=100)
    variable = models.CharField(max_length=100)


class OutputPage(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()

    image = models.ForeignKey(
        ImageModel,
        on_delete=models.CASCADE,
    )

    output_values = models.ManyToManyField(OutputValue)
    output_unit = models.CharField(max_length=50)


class Configuration(models.Model):
    input_pages = models.ManyToManyField(InputPage)
    output_page = models.ForeignKey(OutputPage, on_delete=models.CASCADE)
    formula_list_json = models.TextField()

    def set_formula_list(self, formula_list):
        self.formula_list_json = json.dumps(formula_list)

    def get_formula_list(self):
        return json.loads(self.formula_list_json)


# Customer
class Customer(models.Model):
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15)

    def __str__(self):
        return f"{self.name} {self.surname}"
