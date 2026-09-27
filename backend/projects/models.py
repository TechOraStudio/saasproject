from django.db import models


class Project(models.Model):
    name = models.CharField(max_length=150)
    client = models.CharField(max_length=150)
    status = models.CharField(max_length=50, default="In Progress")
    progress = models.IntegerField(default=0)

    def __str__(self):
        return self.name