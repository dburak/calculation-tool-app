# calculation-tool
No-code Calculation Tool App

This application is about creating a tool for admin users and let them create their own apps with their self defined pages and calculations. The admins will be able to create their own applications thanks to the calculation tool. The calculation tool will allow the admin to create an app in which they can decide how many pages they want to present to their users and what kind of calculations will take place as the users navigate through pages in the app and reach the output page.


## Technologies Used

**Frontend:** React, Redux Toolkit along with Redux Thunk, Material UI, CSS

**Backend:** NodeJS, Express, MongoDB & Mongoose, JWT

**Deployment:** render.com, MongoDB Atlas

## Demo

Live on: https://calculation-tool.onrender.com

## API DOCUMENTATION

### POST - Create a user

    https://calculation-tool.onrender.com/api/users HTTP/1.1 201 Created
    Content-Type: application/json
    Authorization: No Auth

    {
     "email":"admin@gmail.com",
     "name":"Admin",
     "password":"123456"
    }

### POST - Login user

    https://calculation-tool.onrender.com/api/login HTTP/1.1 200 OK
    Content-Type: application/json
    Authorization: No Auth

    {
     "email":"admin@gmail.com",
     "password":"123456"
    }

### GET - Get all configuration

    https://calculation-tool.onrender.com/api/configurations HTTP/1.1 200 OK
    Content-Type: application/json
    Authorization: No Auth

### PUT - Create a configuration OR update a configuration
- Since there will always be only one record in the database, there is no need to use both the POST and PUT methods here.
- If there are no records, the PUT method performs a creation; if a record exists, it performs an update.
- Therefore, we can use the PUT method to both create and update purpose.

      Request:
      https://calculation-tool.onrender.com/api/configurations HTTP/1.1
      Content-Type: multipart/form-data
      Authorization: Bearer Token

      Response:
      https://calculation-tool.onrender.com/api/configurations HTTP/1.1 201 Created
      Content-Type: application/json

      

      {
      "outputPage": {
        "title": "Evinizin yaklaşık satış fiyatı ve kira değeri",
        "description": "Evinizin yaklaşık satış fiyatı ve kira değeri aşağıda hesaplanmıştır.",
        "image": "https://calculation-tool.onrender.com/uploads/images/289e3126-aa1b-4e53-9e9b-9ca9f59035fb.jpeg",
        "outputValues": [
            {
                "placeholder": "Satış Fiyatı",
                "variable": "A",
            },
            {
                "placeholder": "Kira Değeri",
                "variable": "B",
            }
        ],
        "outputUnit": "TL"
      },
      "inputPages": [
        {
            "title": "Eviniz kaç yıllık ?",
            "description": "Evinizin kaç yıllık olduğunu girin.",
            "image": "https://calculation-tool.onrender.com/uploads/images/482f0af6-b968-4f7d-a90d-caa517a017c8.jpeg",
            "inputValues": [
                {
                    "placeholder": "Evinizin Yaşı",
                    "variable": "X",
                }
            ],
        },
        {
            "title": "Evinizde kaç oda ve banyo var ?",
            "description": "Eviniz hakkında aşağıdaki detayları doldurun.",
            "image": "https://calculation-tool.onrender.com/uploads/images/a3d5c0c4-d138-4ad3-876b-0512c0404302.jpeg",
            "inputValues": [
                {
                    "placeholder": "Oda Sayısı",
                    "variable": "Y",
                    "_id": "64dec000aba97ff11a169bc0"
                },
                {
                    "placeholder": "Banyo Sayısı",
                    "variable": "Z",
                }
            ],
        }
      ],
      "formulaList": [
        "A = (Y * 100.000 + Z * 50.000 ) - ( X * 10.000 )",
        "B = A / 200"
        ],
      }
  
### DELETE - Delete the configuration
- Since there will always be only one record in the database, there is no need to provide an id parametre here.

      https://calculation-tool.onrender.com/api/configurations HTTP/1.1 204 No Content
      Content-Type: application/json
      Authorization: Bearer Token

### POST - Perform a calculation

    https://calculation-tool.onrender.com/api/calculation HTTP/1.1 200 OK
    Content-Type: application/json
    Authorization: No Auth

    {
    "formulaList": [
      "A = (Y * 100.000 + Z * 50.000 ) - ( X * 10.000 )",
      "B = A / 200"
    ],
    "inputValues": {
      "X": "3",
      "Y": "4",
      "Z": "5"
      }
    }
