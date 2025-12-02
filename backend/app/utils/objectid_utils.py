from bson import ObjectId
from bson.errors import InvalidId
from typing import Optional, Any
from pydantic import GetJsonSchemaHandler
from pydantic.json_schema import JsonSchemaValue
from pydantic_core import core_schema


class PyObjectId(ObjectId):
    
    @classmethod
    def __get_pydantic_core_schema__(
        cls,
        _source_type: Any,
        _handler: Any,
    ) -> core_schema.CoreSchema:
        
        return core_schema.union_schema([
                                            core_schema.is_instance_schema(ObjectId),
                                            core_schema.chain_schema([
                                                                        core_schema.str_schema(),
                                                                        core_schema.no_info_plain_validator_function(cls.validate),
                                                                    ])
                                        ])

    
    @classmethod
    def __get_pydantic_json_schema__(
                                        cls, _core_schema: core_schema.CoreSchema, handler: GetJsonSchemaHandler
                                    ) -> JsonSchemaValue:
        return handler(core_schema.str_schema())
    
    @classmethod
    def validate(cls, v: Any) -> ObjectId:
        if isinstance(v, ObjectId):
            return v
        if isinstance(v, str):
            try:
                return ObjectId(v)
            except InvalidId:
                raise ValueError(f"Invalid ObjectId: {v}")
        raise ValueError(f"Cannot convert {type(v)} to ObjectId")


def str_to_objectid(id_str: str) -> Optional[ObjectId]:
    if not id_str:
        return None
    
    try:
        return ObjectId(id_str)
    except (InvalidId, TypeError):
        return None


def objectid_to_str(obj_id: ObjectId) -> str:
    return str(obj_id)


def validate_objectid(id_str: str) -> bool:
    if not id_str:
        return False
    
    try:
        ObjectId(id_str)
        return True
    except (InvalidId, TypeError):
        return False


def ensure_objectid(value: Any) -> ObjectId:
    if isinstance(value, ObjectId):
        return value
    
    if isinstance(value, str):
        obj_id = str_to_objectid(value)
        if obj_id is None:
            raise ValueError(f"Invalid ObjectId: {value}")
        return obj_id
    
    raise ValueError(f"Cannot convert {type(value)} to ObjectId")
