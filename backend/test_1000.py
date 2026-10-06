import asyncio
import aiohttp
import time

URL = "http://127.0.0.1:8000/users/1"

TOTAL_REQUESTS = 10000


async def send_request(session, request_number):

    try:
        async with session.get(URL) as response:

            data = await response.json()

            return {
                "request": request_number,
                "status": response.status,
                "source": data.get("source")
            }

    except Exception as e:

        return {
            "request": request_number,
            "error": str(e)
        }


async def main():

    start = time.time()

    async with aiohttp.ClientSession() as session:

        tasks = []

        for i in range(TOTAL_REQUESTS):

            tasks.append(
                send_request(session, i + 1)
            )

        results = await asyncio.gather(*tasks)

    end = time.time()

    print("\n========== RESULT ==========")

    success = [
        r for r in results
        if r.get("status") == 200
    ]

    redis_count = sum(
        1 for r in success
        if r.get("source") == "redis"
    )

    database_count = sum(
        1 for r in success
        if r.get("source") == "database"
    )

    errors = len(results) - len(success)

    print("Total requests :", TOTAL_REQUESTS)
    print("Successful     :", len(success))
    print("Redis responses:", redis_count)
    print("DB responses   :", database_count)
    print("Errors         :", errors)
    print("Time taken     :", round(end - start, 2), "seconds")


asyncio.run(main())