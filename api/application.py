from flask import Flask, jsonify, request
import psycopg2 as pg


hostname = "127.0.0.1"
database = "areia"
username  = "postgres"
pwd = "170501"
port_id = 54321

conn = None
curr = None

app = Flask(__name__)

# conn = pg2.connect(dbname="userDetails", user=)

@app.route('/', methods=['GET'])
def index():
    return 'Hello!'

@app.route('/drinks')
def get_drinks():
    drinks = {"Success": "True"}
    try:
        conn = pg.connect(host = hostname,
                            dbname = database,
                            user = username,
                            )

        curr = conn.cursor()
        
        # insert_script = '''
        #                 INSERT INTO userdetails(username, passcode)
        #                 VALUES('ynagle', 'ynagle123');
        # '''

        insert_script = 'INSERT INTO userdetails (username, passcode) VALUES (%s, %s)'
        insert_values  = ('ssoparkar', 'ssoparkar123')

        #for multiple values, use a for loop


        curr.execute(insert_script, insert_values)
        conn.commit()

    except Exception as error:
        print(error)

    finally:
        if curr:
            curr.close()

        if conn:
            conn.close()
    return drinks

@app.route('/test', methods = ['GET'])
def test_func():

    val1 = {'val': None}
    try:
        conn = pg.connect(host = hostname,
                            dbname = database,
                            user = username,
                            )

        curr = conn.cursor()

        get_script = '''
                        SELECT *
                        FROM userdetails;
        '''

        curr.execute(get_script)
        val = curr.fetchall()
        val1['val'] = val
        conn.commit()
    except Exception as error:
        print(error)

    finally:
        if curr:
            curr.close()

        if conn:
            conn.close()

    return jsonify(val1)


@app.route('/receive_test', methods = ['POST'])
def receive_test():
    data = request.get_json()

    print(data)

    
    return jsonify({"Connection": "Success"})