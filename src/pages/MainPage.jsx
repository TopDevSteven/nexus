import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header/Header";
import Toolbar from "../components/Toolbar/Toolbar";
import Workspace from "../components/WorkingArea/WorkingArea";
import TextToolbar from "../components/Toolbar/TextToolbar";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ".././assets/transition.scss";

const MainPage = () => {
    const [showTextToolbar, setShowTextToolbar] = useState(false);
    const textToolbarRef = useRef(null);
    const textToolRef = useRef(null);

    const handleTextToolClick = (e) => {
        if (textToolbarRef.current && textToolbarRef.current.contains(e.target)) {
            return;
        } else {
            setShowTextToolbar(false);
        } 
    }

    const handleTextToolFocus = () => {
        setShowTextToolbar(true);
    }

    const handleTextToolBlur = () => {
        setShowTextToolbar(false);
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleTextToolClick);

        return () => {
            document.removeEventListener("mousedown", handleTextToolClick);
        };
    }, []);

    return (
        <div className="main-page">
            <DndProvider backend={HTML5Backend}>
                <Header />
                <div className="home-container">
                    <TransitionGroup>
                        {showTextToolbar ? 
                            <CSSTransition key="text" timeout={300} classNames="fade">
                                <TextToolbar              
                                    ref={textToolbarRef}
                                />
                            </CSSTransition>
                            :
                            <CSSTransition key="main" timeout={300} classNames="fade">
                                <Toolbar />
                            </CSSTransition>
                        }
                    </TransitionGroup>
                    <Workspace
                        onTextFocus={handleTextToolFocus}
                        onTextBlur={handleTextToolBlur}
                        textRef={textToolRef}
                    />     
                </div>
            </DndProvider>
        </div>
    )
}

export default MainPage;