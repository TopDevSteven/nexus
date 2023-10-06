import React, { useState } from 'react';

const TextToolbar = React.forwardRef((props, ref) => {
    // ... rest of your TextToolbar component

    return (
        <div 
            ref={ref} 
            className="text-toolbar" 
            style={{height: '100%'}}
        >
            {/* ... toolbar content */}
            text
        </div>
    );
});

export default TextToolbar;