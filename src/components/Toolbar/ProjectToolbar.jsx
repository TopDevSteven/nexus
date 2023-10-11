import React from 'react';
import { useDrag } from 'react-dnd';
import { ReactComponent as ProjectIcon } from "../../assets/icons/project_tool/project.svg"

function ProjectTool() {
    const [, ref] = useDrag({
        type: 'PROJECT',  // This is important
        item: {toolType: 'PROJECT'}
    });

    return (
        <div ref={ref}>
            <span>
                <ProjectIcon />
            </span>
            <p>Project</p>
        </div>
    );
}

function ProjectToolbar() {
    return (
        <div className='app-projecttool-bar'>
            <ProjectTool />
        </div>
    );
}

export default ProjectToolbar;