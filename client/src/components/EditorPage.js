import React, { useEffect, useRef, useState } from "react";
import Client from "./Client";
import Editor from "./Editor";
import { initSocket } from "../Socket";
import { ACTIONS } from "../Actions";
import {
    useNavigate,
    useLocation,
    Navigate,
    useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

const LANGUAGES = [
    "python3", "java", "cpp", "nodejs", "c", "ruby", "go", "scala",
    "bash", "sql", "pascal", "csharp", "php", "swift", "rust", "r",
];

function EditorPage() {
    const [clients, setClients] = useState([]);
    const [output, setOutput] = useState("");
    const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);
    const [isCompiling, setIsCompiling] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("python3");
    const codeRef = useRef(null);

    const Location = useLocation();
    const navigate = useNavigate();
    const { roomId } = useParams();
    const socketRef = useRef(null);

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on("connect_error", (err) => handleErrors(err));
            socketRef.current.on("connect_failed", (err) => handleErrors(err));

            const handleErrors = (err) => {
                console.log("Error", err);
                toast.error("Socket connection failed, Try again later");
                navigate("/");
            };

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: Location.state?.username,
            });

            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== Location.state?.username) {
                        toast.success(`${username} joined the room.`);
                    }
                    setClients(clients);
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                }
            );

            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room`);
                setClients((prev) => {
                    return prev.filter((client) => client.socketId !== socketId);
                });
            });
        };
        init();

        return () => {
            socketRef.current && socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        };
    }, [navigate, roomId, Location.state?.username]);

    if (!Location.state) {
        return <Navigate to="/" />;
    }

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success(`Room ID is copied`);
        } catch (error) {
            console.log(error);
            toast.error("Unable to copy the room ID");
        }
    };

    const leaveRoom = async () => {
        navigate("/");
    };

    const runCode = async () => {
        setIsCompiling(true);
        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
            const response = await axios.post(`${backendUrl}/compile`, {
                code: codeRef.current,
                language: selectedLanguage,
            });
            console.log("Backend response:", response.data);
            setOutput(response.data.output || JSON.stringify(response.data));
        } catch (error) {
            console.error("Error compiling code:", error);
            setOutput(error.response?.data?.error || "An error occurred");
        } finally {
            setIsCompiling(false);
        }
    };

    const toggleCompileWindow = () => {
        setIsCompileWindowOpen(!isCompileWindowOpen);
    };

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            width: '100vw',
            backgroundColor: '#121212',
            overflow: 'hidden',
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
        }}>

            <div style={{
                width: '260px',
                backgroundColor: '#1e1e1e',
                borderRight: '1px solid #333',
                display: 'flex',
                flexDirection: 'column',
                padding: '20px'
            }}>
                <div style={{ borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                        src="/images/image.png"
                        alt="Logo"
                        style={{ maxWidth: "120px", objectFit: 'contain' }}
                    />
                </div>

                <h6 style={{ color: '#888', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px', marginBottom: '15px' }}>
                    Connected Members
                </h6>

                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
                    {clients.map((client) => (
                        <Client key={client.socketId} username={client.username} />
                    ))}
                </div>

                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                        onClick={copyRoomId}
                        style={{ padding: '10px', backgroundColor: '#007acc', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#005f9e'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#007acc'}
                    >
                        Copy Room ID
                    </button>
                    <button
                        onClick={leaveRoom}
                        style={{ padding: '10px', backgroundColor: '#d13438', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#a1262b'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#d13438'}
                    >
                        Leave Room
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>

                <div style={{
                    height: '55px',
                    backgroundColor: '#1e1e1e',
                    borderBottom: '1px solid #333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    padding: '0 20px',
                    gap: '15px'
                }}>
                    <select
                        style={{
                            padding: '6px 12px',
                            backgroundColor: '#2d2d2d',
                            color: '#e0e0e0',
                            border: '1px solid #444',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            outline: 'none'
                        }}
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                    >
                        {LANGUAGES.map((lang) => (
                            <option key={lang} value={lang}>{lang}</option>
                        ))}
                    </select>

                    <button
                        onClick={toggleCompileWindow}
                        style={{ padding: '6px 15px', backgroundColor: '#333', color: '#fff', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        {isCompileWindowOpen ? 'Close Terminal' : 'Open Terminal'}
                    </button>
                    <button
                        onClick={runCode}
                        disabled={isCompiling}
                        style={{
                            padding: '6px 20px',
                            backgroundColor: isCompiling ? '#444' : '#007acc',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isCompiling ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        {isCompiling ? "Compiling..." : "Run Code ▷"}
                    </button>
                </div>

                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <Editor
                        socketRef={socketRef}
                        roomId={roomId}
                        onCodeChange={(code) => {
                            codeRef.current = code;
                        }}
                    />
                </div>

                <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: '#1e1e1e',
                    height: isCompileWindowOpen ? "35vh" : "0",
                    borderTop: isCompileWindowOpen ? "1px solid #007acc" : "none",
                    transition: "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    overflow: "hidden",
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: isCompileWindowOpen ? '0 -10px 20px rgba(0,0,0,0.3)' : 'none',
                    zIndex: 10
                }}>
                    <div style={{ padding: '10px 20px', backgroundColor: '#252526', borderBottom: '1px solid #333', color: '#ccc', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', letterSpacing: '1px' }}>OUTPUT TERMINAL</span>
                        <span onClick={toggleCompileWindow} style={{ cursor: 'pointer', color: '#888', fontSize: '16px' }}>✕</span>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '15px 20px', backgroundColor: '#1e1e1e' }}>
                        <pre style={{ margin: 0, color: '#10b981', fontFamily: '"Fira Code", "Courier New", monospace', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                            {output || "Waiting for execution..."}
                        </pre>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default EditorPage;