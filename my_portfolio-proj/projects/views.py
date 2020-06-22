# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

# Create your views here.
from projects.models import Project


def homepage(request):
    projects = Project.objects.all()
    types = Project.objects.values('type').distinct()
    return render(request, 'index2.html', {'projects': projects, 'types': types})