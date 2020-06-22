# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.
class Project(models.Model):
    title = models.CharField(max_length=70, blank=None)
    desc = models.CharField(max_length=255, blank=None)
    imgUrl = models.ImageField(upload_to="projects/images", blank=None)
    url = models.URLField(blank=True)
    type = models.CharField(max_length=70, blank=None, default="APP")