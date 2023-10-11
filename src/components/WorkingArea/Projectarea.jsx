import React, { useState, useEffect } from "react";
import { useDrop } from 'react-dnd';
import Project from "../Toolbar/Project";
import { v4 as uuidv4 } from 'uuid';

const ProjectArea = ({onProjectDoubleClick}) => {
    const [projects, setProjects] = useState([]);

    const [, ref] = useDrop({
        accept: 'PROJECT',
        drop: (item, monitor) => {
            const position = monitor.getClientOffset();
            position.x = position.x - 80;
            position.y = position.y -140;
            let id = uuidv4();
            const newProject = {
                id: id,
                type: 'PROJECT',
                position
            };
            setProjects(prev => {
                let updatedProjects = [...prev, newProject];
                localStorage.setItem("projects", JSON.stringify(updatedProjects));
                return updatedProjects;
            });
        }
    });

    const updatePosition = (projectId, newPosition) => {
        setProjects(prev => {
            const updatedProjects = prev.map(project => {
                if (project.id === projectId) {
                    return { ...project, position: newPosition };
                }
                return project;
            });
            localStorage.setItem("projects", JSON.stringify(updatedProjects));
            return updatedProjects;
        });
    };

    useEffect(() => {
        const savedProjects = localStorage.getItem("projects");
        if (savedProjects) {
            setProjects(JSON.parse(savedProjects));
            console.log(savedProjects);
        }
    }, []);

    const handleProjectMove = (id, position) => {
        console.log(position)
        setProjects((prevProjects) => {
            const updatedProjects = prevProjects.map((project) => {
                if (project.id === id) {
                    return { ...project, position };
                }
                return project;
            });
            localStorage.setItem("projects", JSON.stringify(updatedProjects));
            return updatedProjects;
        });
    };

    // localStorage.clear()

    return (
        <div className="app-projectspace" ref={ref}>
            {
                projects.map((project, index) => {
                    console.log('Rendering project at:', project.position);
                    return (
                        <Project
                            key={index}
                            style={{ 
                                position: 'absolute',
                                top: project.position.y, 
                                left: project.position.x,
                            }}
                            onDoubleClick={onProjectDoubleClick}
                            id={project.id}
                            updatePosition={updatePosition}
                            onMove={handleProjectMove}
                        />
                    );
                })
            }
        </div>
    );
};

export default ProjectArea;