from django.urls import path
from calc_tool.views import UserApiView
from calc_tool.views import LoginView
from calc_tool.views import ConfigurationView
from calc_tool.views import CalculationView
from calc_tool.views import CustomerView

from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path("users", UserApiView.as_view()),
    path("login", LoginView.as_view()),
    path("configurations", ConfigurationView.as_view()),
    path('configurations/inputpage/<int:input_page_id>', ConfigurationView.as_view(), name='delete_page_with_id'),
    path('configurations/inputpage/value/<int:input_value_id>', ConfigurationView.as_view(), name='delete_value_with_id'),
    path('configurations/outputpage/value/<int:output_value_id>', ConfigurationView.as_view(), name='delete_value_with_id'),
    path("calculation", CalculationView.as_view()),
    path("customers", CustomerView.as_view()),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
