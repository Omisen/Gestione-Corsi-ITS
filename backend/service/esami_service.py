from Esami.models import Esami

def getall_esami():
    return Esami.objects()

def create_esame(data):
    return Esami.save()