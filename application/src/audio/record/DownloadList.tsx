import React, { MutableRefObject } from "react";

import { RecordingsCollection } from './RecordingsCollection';

import './DownloadList.css';

type DownloadListProps = {

    items: RecordingsCollection;

    onItemDeleted: (index: number) => void,
}

function DownloadList( { items, onItemDeleted }: DownloadListProps) {

    return (
        <div id="download-list" className="container">
            {items.mapRecordings((index, recording) =>
                <DownloadItem
                    key={index}
                    index={index}
                    item={recording}
                    onItemDeleted={() => onItemDeleted(index)}
                />
            )}
        </div>
    );
}

type DownloadItemProps = {

    index: number,

    item: string,

    onItemDeleted: () => void,
}

function DownloadItem( { index, item, onItemDeleted }: DownloadItemProps) {

    const elAnchor = React.useRef<HTMLAnchorElement>(null) as MutableRefObject<HTMLAnchorElement>;
    const elFormElementDisplayName = React.useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>;

    const onToggleRename = () => {
        const el = elFormElementDisplayName.current;
        const hidden = el.className.includes("hidden");
        el.className = hidden ? "" : " hidden";
        elAnchor.current.className = hidden ? "hidden" : "";
    }

    const [displayName, setDisplayName] = React.useState(`recording-${index}`);

    const onSetDisplayName = (value: string) => {
        value = value.trim().replace(/\s+/g, ' ').replace(/[^a-zA-Z0-9\-_ ]/g, '');

        setDisplayName(value);
    }

    const downloadFileName = displayName.toLowerCase().replace(/\s+/, '_');

    return (
        <div className="download-list-item">
            <button className="button-label" onClick={onItemDeleted}>X</button>
            <button className="button-label" onClick={onToggleRename}>Rename</button>
            <a
                ref={elAnchor}
                href={item}
                download={`audiowander-${downloadFileName}.webm`}
            >
                {`${index}: ${displayName}`}
            </a>
            <div
                ref={elFormElementDisplayName}
                className="hidden"
            >
                <input
                    type="text"
                    value={displayName}
                    onChange={(e) => onSetDisplayName(e.target.value) }
                />
            </div>
        </div>
    );
}

export { DownloadList };
