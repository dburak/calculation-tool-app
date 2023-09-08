# Generated by Django 4.2.4 on 2023-08-29 14:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calc_tool', '0002_usermodel_is_admin_usermodel_surname_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='usermodel',
            name='is_admin',
        ),
        migrations.RemoveField(
            model_name='usermodel',
            name='surname',
        ),
        migrations.AddField(
            model_name='usermodel',
            name='email',
            field=models.TextField(default=''),
        ),
        migrations.AlterField(
            model_name='usermodel',
            name='name',
            field=models.TextField(default=''),
        ),
        migrations.AlterModelTable(
            name='usermodel',
            table='user',
        ),
    ]