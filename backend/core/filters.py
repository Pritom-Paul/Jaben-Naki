import django_filters
from .models import Trip
from django.db.models import Q

class TripFilter(django_filters.FilterSet):
    destination = django_filters.CharFilter(field_name='destination', lookup_expr='icontains')
    start_date = django_filters.DateFilter(field_name='start_date', lookup_expr='gte')
    end_date = django_filters.DateFilter(field_name='end_date', lookup_expr='lte')
    tags = django_filters.CharFilter(method='filter_by_tags')

    class Meta:
        model = Trip
        fields = ['destination', 'start_date', 'end_date', 'tags']

    def filter_by_tags(self, queryset, name, value):
        tag_list = value.split(',')
        for tag in tag_list:
            queryset = queryset.filter(tags__name__in=[tag])
        return queryset.distinct()
