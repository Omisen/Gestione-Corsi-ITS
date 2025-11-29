from faker import Faker
from datetime import datetime
import re

fake = Faker("it_IT")

class Auto_Gen_Data:

    @staticmethod
    def generazione_fake_studente(num=10):
        studenti = []
        for _ in range(num):
            nome = fake.first_name()
            cognome = fake.last_name()
            email = Auto_Gen_Data.validazione_email(f"{nome.lower()}.{cognome.lower()}@example.com")
            studenti.append({
                                "nome": nome,
                                "cognome": cognome,
                                "email": email,
                                "moduli": [],
                                "esami": []
                            })
        return studenti

    @staticmethod
    def generazione_fake_modulo(num=5):
        moduli = []
        for _ in range(num):
            nome = fake.job()
            codice = fake.bothify(text="MOD-###")
            totale_ore = fake.random_int(min=20, max=100)

            moduli.append({
                "nome": nome,
                "codice": codice,
                "totale_ore": totale_ore,
                "descrizione": fake.sentence(),
            })
        return moduli

    @staticmethod
    def generazione_fake_esame(studente, modulo, num=3):
        esame = []
        for _ in range(num):
            esame.append({
                "studente": studente,
                "modulo": modulo,
                "data": fake.date_between(start_date="-2y", end_date="today"),
                "voto": fake.random_int(min=18, max=30),
                "note": fake.sentence()
            })
        return esame

    @staticmethod
    def validazione_email(email):
        #! Fa il retaurn del email solo se valida mediante controllo regex altrimenti ne genera una corretta con faker
        pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        if re.match(pattern, email):
            return email
        return fake.email()

    @staticmethod
    def format_data(data):
        #! Fa la formatttazione della data in stringa leggbile in giorno-mese-anno
        if isinstance(data, datetime):
            return data.strftime("%d/%m/%Y")
        return str(data)
