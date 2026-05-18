import React from 'react';
import Avatar from 'react-avatar';

function Client({ username }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 15px',
            borderRadius: '8px',
            backgroundColor: '#2d2d2d',
            marginBottom: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #3e3e42'
        }}>
            {/* AVATAR */}
            <Avatar name={username.toString()} size={35} round="8px" />

            <span style={{
                marginLeft: '12px',
                fontWeight: '500',
                color: '#e0e0e0',
                fontSize: '15px',
                letterSpacing: '0.5px'
            }}>
                {username.toString()}
            </span>
        </div>
    );
}

export default Client;