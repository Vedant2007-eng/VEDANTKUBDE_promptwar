import asyncio
from typing import Optional, Dict, Any, List
import motor.motor_asyncio
from app.core.config import settings
from app.core.logging import logger


class DatabaseManager:
    client: Optional[motor.motor_asyncio.AsyncIOMotorClient] = None
    db: Optional[motor.motor_asyncio.AsyncIOMotorDatabase] = None
    is_connected: bool = False
    
    # In-memory document fallback store for zero-friction local development & testing
    _memory_store: Dict[str, Dict[str, Any]] = {
        "decisions": {},
        "analyses": {},
        "reflections": {},
        "users": {},
    }

    async def connect(self):
        try:
            logger.info("Attempting connection to MongoDB at %s...", settings.MONGODB_URI)
            self.client = motor.motor_asyncio.AsyncIOMotorClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=2000,
            )
            # Test ping
            await self.client.admin.command("ping")
            self.db = self.client[settings.DATABASE_NAME]
            self.is_connected = True
            logger.info("Successfully connected to MongoDB database '%s'.", settings.DATABASE_NAME)
        except Exception as e:
            self.is_connected = False
            logger.warning(
                "MongoDB not reachable (%s). Falling back to built-in in-memory document store. All operations will succeed seamlessly.",
                str(e),
            )

    async def close(self):
        if self.client:
            self.client.close()
            self.is_connected = False
            logger.info("Closed MongoDB client connection.")

    # Generic repository helpers that handle both Mongo and In-Memory fallback
    async def insert_one(self, collection_name: str, document: Dict[str, Any]) -> str:
        doc_id = str(document.get("id") or document.get("_id") or f"id_{len(self._memory_store.get(collection_name, {})) + 1}")
        document["_id"] = doc_id
        document["id"] = doc_id

        if self.is_connected and self.db is not None:
            try:
                coll = self.db[collection_name]
                await coll.insert_one(document)
                return doc_id
            except Exception as e:
                logger.error("Mongo insert error (%s), saving to memory fallback", e)

        # Fallback to in-memory
        if collection_name not in self._memory_store:
            self._memory_store[collection_name] = {}
        self._memory_store[collection_name][doc_id] = document
        return doc_id

    async def find_one(self, collection_name: str, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if self.is_connected and self.db is not None:
            try:
                coll = self.db[collection_name]
                doc = await coll.find_one(query)
                if doc:
                    doc["id"] = str(doc.get("_id", doc.get("id")))
                    return doc
            except Exception as e:
                logger.error("Mongo find error (%s), checking memory fallback", e)

        # In-memory search
        store = self._memory_store.get(collection_name, {})
        for doc in store.values():
            match = True
            for k, v in query.items():
                target_key = "id" if k in ["_id", "id"] else k
                if doc.get(target_key) != v and doc.get(k) != v:
                    match = False
                    break
            if match:
                return dict(doc)
        return None

    async def find_many(self, collection_name: str, query: Optional[Dict[str, Any]] = None, limit: int = 100) -> List[Dict[str, Any]]:
        query = query or {}
        if self.is_connected and self.db is not None:
            try:
                coll = self.db[collection_name]
                cursor = coll.find(query).sort("created_at", -1).limit(limit)
                docs = []
                async for item in cursor:
                    item["id"] = str(item.get("_id", item.get("id")))
                    docs.append(item)
                return docs
            except Exception as e:
                logger.error("Mongo find_many error (%s), checking memory fallback", e)

        # In-memory
        store = self._memory_store.get(collection_name, {})
        results = []
        for doc in store.values():
            match = True
            for k, v in query.items():
                target_key = "id" if k in ["_id", "id"] else k
                if doc.get(target_key) != v and doc.get(k) != v:
                    match = False
                    break
            if match:
                results.append(dict(doc))
        # Sort descending by created_at if present
        results.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return results[:limit]

    async def update_one(self, collection_name: str, query: Dict[str, Any], update: Dict[str, Any]) -> bool:
        if self.is_connected and self.db is not None:
            try:
                coll = self.db[collection_name]
                result = await coll.update_one(query, {"$set": update})
                return result.modified_count > 0 or result.matched_count > 0
            except Exception as e:
                logger.error("Mongo update error (%s), updating memory fallback", e)

        # In-memory
        doc = await self.find_one(collection_name, query)
        if doc:
            doc_id = doc["id"]
            self._memory_store[collection_name][doc_id].update(update)
            return True
        return False

    async def delete_one(self, collection_name: str, query: Dict[str, Any]) -> bool:
        if self.is_connected and self.db is not None:
            try:
                coll = self.db[collection_name]
                result = await coll.delete_one(query)
                return result.deleted_count > 0
            except Exception as e:
                logger.error("Mongo delete error (%s), deleting from memory fallback", e)

        doc = await self.find_one(collection_name, query)
        if doc:
            doc_id = doc["id"]
            self._memory_store[collection_name].pop(doc_id, None)
            return True
        return False


db_manager = DatabaseManager()
