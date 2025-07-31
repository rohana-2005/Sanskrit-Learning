import mysql.connector;

def get_db_connection():
    connection = mysql.connector.connect(
        host='localhost',
        user='root',
        password='Ruchi@123',  # ← Replace with your password
        database='sanskrit_learning'  # ← Replace with your database
    )
    return connection

def initialize_database():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Create users table with score column
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                score INT DEFAULT 0
            )
        """)
        
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error initializing database: {str(e)}")

# Initialize database on module import
initialize_database()