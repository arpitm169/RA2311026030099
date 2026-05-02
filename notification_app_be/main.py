import requests
from datetime import datetime
import heapq

# Priority weights
TYPE_WEIGHT = {
    "Placement": 3,
    "Result": 2,
    "Event": 1
}

API_URL = "http://20.207.122.201/evaluation-service/notifications"

def get_mock_notifications():
    return [
        {"ID": "1", "Type": "Result", "Message": "mid-sem", "Timestamp": "2026-04-22 17:51:30"},
        {"ID": "2", "Type": "Placement", "Message": "CSX Corporation hiring", "Timestamp": "2026-04-22 17:51:18"},
        {"ID": "3", "Type": "Event", "Message": "farewell", "Timestamp": "2026-04-22 17:51:06"},
        {"ID": "4", "Type": "Result", "Message": "mid-sem", "Timestamp": "2026-04-22 17:50:54"},
        {"ID": "5", "Type": "Result", "Message": "project-review", "Timestamp": "2026-04-22 17:50:42"},
        {"ID": "6", "Type": "Result", "Message": "external", "Timestamp": "2026-04-22 17:50:30"},
        {"ID": "7", "Type": "Result", "Message": "project-review", "Timestamp": "2026-04-22 17:50:18"},
        {"ID": "8", "Type": "Event", "Message": "tech-fest", "Timestamp": "2026-04-22 17:50:06"},
        {"ID": "9", "Type": "Result", "Message": "project-review", "Timestamp": "2026-04-22 17:49:54"},
        {"ID": "10", "Type": "Placement", "Message": "AMD hiring", "Timestamp": "2026-04-22 17:49:42"},
        {"ID": "11", "Type": "Placement", "Message": "Google hiring", "Timestamp": "2026-04-22 17:52:18"},
        {"ID": "12", "Type": "Placement", "Message": "Amazon hiring", "Timestamp": "2026-04-22 17:53:10"},
        {"ID": "13", "Type": "Result", "Message": "Final result", "Timestamp": "2026-04-22 17:54:00"},
        {"ID": "14", "Type": "Event", "Message": "Workshop", "Timestamp": "2026-04-22 17:48:00"}
    ]



def get_notifications():
    headers = {
        "Authorization": "Bearer YOUR_TOKEN_HERE"  # Replace if you get token
    }

    try:
        response = requests.get(API_URL, headers=headers)

        if response.status_code == 200:
            data = response.json()
            return data.get("notifications", [])

        else:
            print(f"API Error ({response.status_code}): {response.text}")
            print("Using fallback data...\n")
            return get_mock_notifications()

    except Exception as e:
        print("Exception:", e)
        print("Using fallback data...\n")
        return get_mock_notifications()


def compute_priority(notification):
    weight = TYPE_WEIGHT.get(notification["Type"], 0)
    
    # Convert timestamp to datetime
    timestamp = datetime.strptime(notification["Timestamp"], "%Y-%m-%d %H:%M:%S")
    
    # Return tuple (priority score, timestamp)
    return (weight, timestamp)

def get_top_n_notifications(n=10):
    notifications = get_notifications()
    
    heap = []  # min-heap
    
    for notif in notifications:
        weight, timestamp = compute_priority(notif)
        
        # Use tuple: (weight, timestamp) for comparison
        item = (weight, timestamp, notif)
        
        if len(heap) < n:
            heapq.heappush(heap, item)
        else:
            # Compare with smallest
            if item > heap[0]:
                heapq.heappop(heap)
                heapq.heappush(heap, item)
    
    # Sort final results (highest priority first)
    result = sorted(heap, reverse=True)
    
    return [item[2] for item in result]


if __name__ == "__main__":
    N = 10
    top_notifications = get_top_n_notifications(N)
    
    print(f"\n--- Stage 1: Top {len(top_notifications)} Priority Notifications ---\n")
    for notif in top_notifications:
        print(f"{notif['Type']:<10} | {notif['Message']:<25} | {notif['Timestamp']}")