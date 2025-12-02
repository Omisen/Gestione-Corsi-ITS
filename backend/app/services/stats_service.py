from typing import Dict, List, Optional, Any
from datetime import datetime
from app.database import get_database


class StatsService:
    
    @staticmethod
    def get_media_voti_per_modulo() -> List[Dict[str, Any]]:
        db = get_database()
        pipeline = [
                        {
                            '$lookup': {
                                            'from': 'modulo',
                                            'localField': 'modulo',
                                            'foreignField': '_id',
                                            'as': 'modulo_info'
                                        }
                        },
                        
                        {
                            '$unwind': '$modulo_info'
                        },
                        
                        {
                            '$group': {
                                            '_id': '$modulo',
                                            'nome_modulo': {'$first': '$modulo_info.nome'},
                                            'codice_modulo': {'$first': '$modulo_info.codice'},
                                            'media_voto': {'$avg': '$voto'},
                                            'numero_esami': {'$sum': 1},
                                            'voto_minimo': {'$min': '$voto'},
                                            'voto_massimo': {'$max': '$voto'}
                                        }
                        },
                        
                        {
                            '$sort': {'media_voto': -1}
                        }
                    ]
        
        results = list(db.esame.aggregate(pipeline))
        
        for result in results:
            result['_id'] = str(result['_id'])
            result['media_voto'] = round(result['media_voto'], 2) if result['media_voto'] else 0
        
        return results
    
    @staticmethod
    def get_studenti_per_modulo() -> List[Dict[str, Any]]:
        db = get_database()
        pipeline = [
                        {
                            '$unwind': '$moduli'
                        },
                        
                        {
                            '$lookup': {
                                            'from': 'modulo',
                                            'localField': 'moduli',
                                            'foreignField': '_id',
                                            'as': 'modulo_info'
                                        }
                        },
                        
                        {
                            '$unwind': '$modulo_info'
                        },
                        
                        {
                            '$group': {
                                            '_id': '$moduli',
                                            'nome_modulo': {'$first': '$modulo_info.nome'},
                                            'codice_modulo': {'$first': '$modulo_info.codice'},
                                            'numero_studenti': {'$sum': 1}
                                        }
                        },
                        
                        {
                            '$sort': {'numero_studenti': -1}
                        }
                    ]
        
        results = list(db.studente.aggregate(pipeline))
        
        for result in results:
            result['_id'] = str(result['_id'])
        
        return results
    
    @staticmethod
    def get_distribuzione_voti(modulo_id: Optional[str] = None) -> List[Dict[str, Any]]:
        db = get_database()
        
        match_stage = {}
        if modulo_id:
            from bson import ObjectId
            match_stage = {'modulo': ObjectId(modulo_id)}
        
        pipeline = [
                        {'$match': match_stage} if match_stage else {'$match': {}},
                        
                        {
                            '$bucket': {
                                            'groupBy': '$voto',
                                            'boundaries': [0, 18, 21, 24, 27, 30, 31],
                                            'default': 'Altro',
                                            'output': {
                                                            'count': {'$sum': 1},
                                                            'voti': {'$push': '$voto'}
                                                        }
                                        }
                        }
                    ]
        
        results = list(db.esame.aggregate(pipeline))
        
        range_labels = {
                            0: '0-17 (Insufficiente)',
                            18: '18-20',
                            21: '21-23',
                            24: '24-26',
                            27: '27-29',
                            30: '30-30L'
                        }
        
        for result in results:
            if result['_id'] != 'Altro':
                result['range'] = range_labels.get(result['_id'], str(result['_id']))
            else:
                result['range'] = result['_id']
        
        return results
    
    @staticmethod
    def get_tasso_successo_per_modulo() -> List[Dict[str, Any]]:
        db = get_database()
        pipeline = [
                        {
                            '$lookup': {
                                            'from': 'modulo',
                                            'localField': 'modulo',
                                            'foreignField': '_id',
                                            'as': 'modulo_info'
                                        }
                        },
                        
                        {
                            '$unwind': '$modulo_info'
                        },
                        
                        {
                            '$group': {
                                            '_id': '$modulo',
                                            'nome_modulo': {'$first': '$modulo_info.nome'},
                                            'codice_modulo': {'$first': '$modulo_info.codice'},
                                            'totale_esami': {'$sum': 1},
                                            'promossi': {
                                                            '$sum': {
                                                                        '$cond': [{'$gte': ['$voto', 18]}, 1, 0]
                                                                    }
                                                        },
                                            
                                            'bocciati': {
                                                            '$sum': {
                                                                        '$cond': [{'$lt': ['$voto', 18]}, 1, 0]
                                                                    }
                                                        }
                                        }
                        },
                        
                        {
                            '$project': {
                                            '_id': 1,
                                            'nome_modulo': 1,
                                            'codice_modulo': 1,
                                            'totale_esami': 1,
                                            'promossi': 1,
                                            'bocciati': 1,
                                            'percentuale_successo': {
                                                                        '$multiply': [
                                                                                            {'$divide': ['$promossi', '$totale_esami']},
                                                                                            100
                                                                                        ]
                                                                    }
                                        }
                        },
                        
                        {
                            '$sort': {'percentuale_successo': -1}
                        }
                    ]
        
        results = list(db.esame.aggregate(pipeline))
        
        for result in results:
            result['_id'] = str(result['_id'])
            result['percentuale_successo'] = round(result['percentuale_successo'], 2) if result['percentuale_successo'] else 0
        
        return results
    
    @staticmethod
    def get_esami_per_periodo(data_inizio: Optional[datetime] = None, 
                               data_fine: Optional[datetime] = None) -> List[Dict[str, Any]]:
        
        db = get_database()
        
        match_stage = {}
        if data_inizio or data_fine:
            match_stage['data'] = {}
            if data_inizio:
                match_stage['data']['$gte'] = data_inizio
            if data_fine:
                match_stage['data']['$lte'] = data_fine
        
        pipeline = [
                        {'$match': match_stage} if match_stage else {'$match': {}},
                        
                        {
                            '$group': {
                                            '_id': {
                                                        'anno': {'$year': '$data'},
                                                        'mese': {'$month': '$data'}
                                                    },
                                            
                                            'numero_esami': {'$sum': 1},
                                            
                                            'media_voto': {'$avg': '$voto'}
                                        }
                        },
                        
                        {
                            '$sort': {'_id.anno': 1, '_id.mese': 1}
                        }
                    ]
        
        results = list(db.esame.aggregate(pipeline))
        
        mesi = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 
                'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic']
        
        for result in results:
            anno = result['_id']['anno']
            mese = result['_id']['mese']
            result['periodo'] = f"{mesi[mese-1]} {anno}"
            result['anno'] = anno
            result['mese'] = mese
            result['media_voto'] = round(result['media_voto'], 2) if result['media_voto'] else 0
            del result['_id']
        
        return results
    
    @staticmethod
    def get_overview_generale() -> Dict[str, Any]:
        db = get_database()
        
        totale_studenti = db.studente.count_documents({})
        totale_moduli = db.modulo.count_documents({})
        totale_esami = db.esame.count_documents({})
        
        pipeline_media = [
                            {
                                '$group': {
                                                '_id': None,
                                                'media_generale': {'$avg': '$voto'},
                                                'voto_minimo': {'$min': '$voto'},
                                                'voto_massimo': {'$max': '$voto'}
                                            }
                            }
                        ]
        
        media_result = list(db.esame.aggregate(pipeline_media))
        media_generale = round(media_result[0]['media_generale'], 2) if media_result else 0
        voto_min = media_result[0]['voto_minimo'] if media_result else 0
        voto_max = media_result[0]['voto_massimo'] if media_result else 0
        
        promossi = db.esame.count_documents({'voto': {'$gte': 18}})
        tasso_successo = round((promossi / totale_esami * 100), 2) if totale_esami > 0 else 0
        
        return {
                    'totale_studenti': totale_studenti,
                    'totale_moduli': totale_moduli,
                    'totale_esami': totale_esami,
                    'media_voti_generale': media_generale,
                    'voto_minimo': voto_min,
                    'voto_massimo': voto_max,
                    'tasso_successo_percentuale': tasso_successo,
                    'esami_promossi': promossi,
                    'esami_bocciati': totale_esami - promossi
                }
