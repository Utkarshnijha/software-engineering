from Integration import Registered_User, Session

def view_registered_users():
    session = Session()
    users = session.query(Registered_User).all()

    if not users:
        print("No users found.")
        return

    for user in users:
        print(f"User ID: {user.User_id}, Email: {user.Email}")

if __name__ == "__main__":
    view_registered_users()
