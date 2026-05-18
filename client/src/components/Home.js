import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Home() {
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const generateRoomId = (e) => {
        e.preventDefault();
        const Id = uuid();
        setRoomId(Id);
        toast.success("Room ID generated!");
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error("Both Room ID and Username are required.");
            return;
        }
        navigate(`/editor/${roomId}`, {
            state: { username },
        });
        toast.success("Joined room successfully.");
    };

    const handleInputEnter = (e) => {
        if (e.code === "Enter") {
            joinRoom();
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            width: '100vw',
            backgroundColor: '#121212',
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
        }}>

            <div style={{
                backgroundColor: '#1e1e1e',
                padding: '40px',
                borderRadius: '10px',
                width: '400px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                border: '1px solid #333',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>

                <img
                    src="/images/image.png"
                    alt="Logo"
                    style={{ maxWidth: "140px", marginBottom: "30px", objectFit: 'contain' }}
                />

                <h4 style={{ color: '#fff', marginBottom: '25px', fontWeight: 'bold', fontSize: '20px', letterSpacing: '0.5px' }}>
                    Join a Workspace
                </h4>

                <div style={{ width: '100%', marginBottom: '15px' }}>
                    <input
                        type="text"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        onKeyUp={handleInputEnter}
                        placeholder="ROOM ID"
                        style={{
                            width: '100%',
                            padding: '12px 15px',
                            backgroundColor: '#2d2d2d',
                            color: '#e0e0e0',
                            border: '1px solid #444',
                            borderRadius: '6px',
                            fontSize: '14px',
                            outline: 'none',
                            transition: 'border 0.2s',
                            boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.target.style.border = '1px solid #007acc'}
                        onBlur={(e) => e.target.style.border = '1px solid #444'}
                    />
                </div>

                <div style={{ width: '100%', marginBottom: '25px' }}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyUp={handleInputEnter}
                        placeholder="USERNAME"
                        style={{
                            width: '100%',
                            padding: '12px 15px',
                            backgroundColor: '#2d2d2d',
                            color: '#e0e0e0',
                            border: '1px solid #444',
                            borderRadius: '6px',
                            fontSize: '14px',
                            outline: 'none',
                            transition: 'border 0.2s',
                            boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.target.style.border = '1px solid #007acc'}
                        onBlur={(e) => e.target.style.border = '1px solid #444'}
                    />
                </div>

                <button
                    onClick={joinRoom}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#007acc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        marginBottom: '20px'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#005f9e'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#007acc'}
                >
                    Join
                </button>

                <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>
                    Don't have an invite?{' '}
                    <span
                        onClick={generateRoomId}
                        style={{
                            color: '#007acc',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.color = '#3399ff'}
                        onMouseOut={(e) => e.target.style.color = '#007acc'}
                    >
                        Create Room
                    </span>
                </p>

            </div>
        </div>
    );
}

export default Home;