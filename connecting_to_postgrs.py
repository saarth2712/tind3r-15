import psycopg2 as pg



hostname = "127.0.0.1"
database = "areia"
username  = "postgres"
pwd = "170501"
port_id = 54321

conn = None
curr = None

try:
    conn = pg.connect(host = hostname,
                        dbname = database,
                        user = username,
                        )

    curr = conn.cursor()
    

    create_script_insta = '''
                    CREATE TABLE IF NOT EXISTS instaDetails(
                        username varchar(25) NOT NULL,
                        insta_username varchar(25),
                        insta_passcode varchar(25),
                        PRIMARY KEY(username)
                    );
    '''

    curr.execute(create_script_insta)
    conn.commit()
    
    create_script = ''' 
                    CREATE TABLE IF NOT EXISTS userDetails(
                        username varchar(25) NOT NULL,
                        passcode varchar(25) NOT NULL,
                        PRIMARY KEY(username)
                    );
    '''

    curr.execute(create_script)
    conn.commit()

except Exception as error:
    print(error)

finally:
    if curr:
        curr.close()

    if conn:
        conn.close()

