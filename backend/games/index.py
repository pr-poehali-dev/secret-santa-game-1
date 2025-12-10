import json
import os
import psycopg2
from typing import Dict, Any, List
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для работы с играми Тайный Санта
    GET /games - получить все игры
    POST /games - создать новую игру
    GET /games/:id - получить игру по ID
    GET /participant/:gameId/:participantId - получить информацию для участника
    '''
    
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ['DATABASE_URL']
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor()
    
    try:
        if method == 'GET':
            query_params = event.get('queryStringParameters', {}) or {}
            path_param = query_params.get('path', '')
            
            if not path_param:
                request_context = event.get('requestContext', {})
                http_path = request_context.get('http', {}).get('path', '')
                if http_path:
                    path_param = http_path
            
            if path_param.startswith('/participant/'):
                parts = path_param.split('/')
                if len(parts) >= 4:
                    game_id = parts[2]
                    participant_id = parts[3]
                    
                    cursor.execute(
                        "SELECT id, name, rules, emoji, created_at FROM t_p50414235_secret_santa_game_1.games WHERE id = %s",
                        (game_id,)
                    )
                    game_row = cursor.fetchone()
                    
                    if not game_row:
                        return {
                            'statusCode': 404,
                            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                            'body': json.dumps({'error': 'Game not found'}),
                            'isBase64Encoded': False
                        }
                    
                    cursor.execute(
                        "SELECT id, name, receiver_id FROM t_p50414235_secret_santa_game_1.participants WHERE game_id = %s",
                        (game_id,)
                    )
                    participants_rows = cursor.fetchall()
                    
                    participants = []
                    for p_row in participants_rows:
                        participants.append({
                            'id': str(p_row[0]),
                            'name': p_row[1],
                            'receiverId': str(p_row[2]) if p_row[2] else None
                        })
                    
                    participant = next((p for p in participants if p['id'] == participant_id), None)
                    receiver = next((p for p in participants if p['id'] == participant.get('receiverId')), None) if participant else None
                    
                    result = {
                        'game': {
                            'id': str(game_row[0]),
                            'name': game_row[1],
                            'rules': game_row[2],
                            'emoji': game_row[3],
                            'createdAt': game_row[4].isoformat()
                        },
                        'participant': participant,
                        'receiver': receiver
                    }
                    
                    cursor.close()
                    conn.close()
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                        'body': json.dumps(result),
                        'isBase64Encoded': False
                    }
            
            elif path_param.startswith('/games/'):
                game_id = path_param.replace('/games/', '')
                
                cursor.execute(
                    "SELECT id, name, rules, emoji, created_at FROM t_p50414235_secret_santa_game_1.games WHERE id = %s",
                    (game_id,)
                )
                game_row = cursor.fetchone()
                
                if not game_row:
                    return {
                        'statusCode': 404,
                        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                        'body': json.dumps({'error': 'Game not found'}),
                        'isBase64Encoded': False
                    }
                
                cursor.execute(
                    "SELECT id, name, receiver_id FROM t_p50414235_secret_santa_game_1.participants WHERE game_id = %s",
                    (game_id,)
                )
                participants_rows = cursor.fetchall()
                
                participants = []
                for p_row in participants_rows:
                    participants.append({
                        'id': str(p_row[0]),
                        'name': p_row[1],
                        'receiverId': str(p_row[2]) if p_row[2] else None
                    })
                
                result = {
                    'id': str(game_row[0]),
                    'name': game_row[1],
                    'rules': game_row[2],
                    'emoji': game_row[3],
                    'createdAt': game_row[4].isoformat(),
                    'participants': participants
                }
                
                cursor.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps(result),
                    'isBase64Encoded': False
                }
            
            else:
                cursor.execute(
                    "SELECT id, name, rules, emoji, created_at FROM t_p50414235_secret_santa_game_1.games ORDER BY created_at DESC"
                )
                games_rows = cursor.fetchall()
                
                games = []
                for game_row in games_rows:
                    game_id = str(game_row[0])
                    
                    cursor.execute(
                        "SELECT id, name, receiver_id FROM t_p50414235_secret_santa_game_1.participants WHERE game_id = %s",
                        (game_id,)
                    )
                    participants_rows = cursor.fetchall()
                    
                    participants = []
                    for p_row in participants_rows:
                        participants.append({
                            'id': str(p_row[0]),
                            'name': p_row[1],
                            'receiverId': str(p_row[2]) if p_row[2] else None
                        })
                    
                    games.append({
                        'id': game_id,
                        'name': game_row[1],
                        'rules': game_row[2],
                        'emoji': game_row[3],
                        'createdAt': game_row[4].isoformat(),
                        'participants': participants
                    })
                
                cursor.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps(games),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            game_id = body_data['id']
            name = body_data['name']
            rules = body_data['rules']
            emoji = body_data.get('emoji', '🎁')
            participants = body_data['participants']
            
            cursor.execute(
                "INSERT INTO t_p50414235_secret_santa_game_1.games (id, name, rules, emoji) VALUES (%s, %s, %s, %s)",
                (game_id, name, rules, emoji)
            )
            
            for participant in participants:
                cursor.execute(
                    "INSERT INTO t_p50414235_secret_santa_game_1.participants (id, game_id, name, receiver_id) VALUES (%s, %s, %s, %s)",
                    (participant['id'], game_id, participant['name'], participant.get('receiverId'))
                )
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'id': game_id, 'message': 'Game created'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
        raise e