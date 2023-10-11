import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header/Header";
import Toolbar from "../components/Toolbar/Toolbar";
import Workspace from "../components/WorkingArea/WorkingArea";
import TextToolbar from "../components/Toolbar/TextToolbar";
import ProjectToolbar from "../components/Toolbar/ProjectToolbar";
import ProjectArea from "../components/WorkingArea/Projectarea";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useParams } from 'react-router-dom';
import ".././assets/transition.scss";
import Logbox from "../components/Header/Log";
import ArrowArea from "../components/WorkingArea/Arrow";

const MainPage = () => {
    const [showTextToolbar, setShowTextToolbar] = useState(false);
    const [isProjectOpen, setIsProjectOpen] = useState(true);
    const textToolbarRef = useRef(null);
    const textToolRef = useRef(null);
    const { uuid} = useParams();

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

    // close the project area and show the working area
    const handleProjectDoubleClick = () => {
        setIsProjectOpen(false); // Close the project and show the toolbar and working area.
    }


    useEffect(() => {
        document.addEventListener("mousedown", handleTextToolClick);

        return () => {
            document.removeEventListener("mousedown", handleTextToolClick);
        };
    }, []);

    useEffect(() => {
        if (uuid) {
            setIsProjectOpen(false);  // Or your necessary logic for when a project is accessed via its URL
        } else {
            setIsProjectOpen(true);
        }
    }, [uuid]);

    return (
        <div className="main-page">
            <DndProvider backend={HTML5Backend}>
                <Logbox />
                <Header />
                <div className="home-container">
                            <div className="tools-wrapper">
                                {/* <TransitionGroup> */}
                                    {showTextToolbar ? 
                                        // <CSSTransition key="text" timeout={300} classNames="fade">
                                            <TextToolbar              
                                                ref={textToolbarRef}
                                            />
                                        // </CSSTransition>
                                        : 
                                            isProjectOpen ? 
                                                // <CSSTransition key="project" timeout={300} classNames="fade">
                                                    <ProjectToolbar />
                                                // </CSSTransition>
                                                : 
                                                // <CSSTransition key="main" timeout={300} classNames="fade">
                                                    <Toolbar />
                                                // </CSSTransition>
                                        
                                    }
                                {/* </TransitionGroup> */}
                            </div>
                    {!isProjectOpen ?
                        // <Workspace
                        //     onTextFocus={handleTextToolFocus}
                        //     onTextBlur={handleTextToolBlur}
                        //     textRef={textToolRef}
                        //     projectId={uuid}
                        // /> : 

                        <ArrowArea />:
                        <ProjectArea
                            onProjectDoubleClick={handleProjectDoubleClick}
                        />
                    }
                </div>
            </DndProvider>
        </div>
    )
}

export default MainPage;