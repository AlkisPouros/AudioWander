import React, { MutableRefObject } from 'react';

import { LoopMetadata } from './loop'
import './Drumkit.css'
import './MetadataController.css';

/**
 * Defines the props for the MetadataController component.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.9
 */
type MetadataControllerProps = {

    /**
     * The metadata which defines the initial values for the controller.
     *
     * @since v0.0.9
     */
    metadata: LoopMetadata;

    /**
     * The callback function to call when the metadata changes.
     *
     * @since v0.0.9
     */
    onSetMetadata: (metadata: LoopMetadata) => void;
}

/**
 * Represents the Metadata Controller component, which allows the user to
 * change the metadata of the drumkit in a controlled manner. It consists of
 * four counters, one for each parameter of the metadata. Changes to the any
 * counter are propagated via a callback function.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.9
 *
 * @see {@link MetadataControllerProps}
 */
function MetadataController({ metadata, onSetMetadata }: MetadataControllerProps) {

    return (
        <div id="metadata-controller">
            <Counter
                name="BPM"
                initial={metadata.bpm}
                min={LoopMetadata.Constraints.MIN_BPM}
                max={LoopMetadata.Constraints.MAX_BPM}
                step={5}
                onSetValue={(bpm: number) => onSetMetadata(metadata.copySetBpm(bpm))}
            />
            <Counter
                name="Bars"
                initial={metadata.bars}
                min={LoopMetadata.Constraints.MIN_BAR_COUNT}
                max={LoopMetadata.Constraints.MAX_BAR_COUNT}
                step={1}
                onSetValue={(bars: number) => onSetMetadata(metadata.copySetBars(bars))}
            />
            <Counter
                name="Beats"
                initial={metadata.beats}
                min={LoopMetadata.Constraints.MIN_BEAT_COUNT}
                max={LoopMetadata.Constraints.MAX_BEAT_COUNT}
                step={1}
                onSetValue={(beats: number) => onSetMetadata(metadata.copySetBeats(beats))}
            />
            <Counter
                name="Subs"
                initial={metadata.subdivisions}
                min={LoopMetadata.Constraints.MIN_SUBDIVISION_COUNT}
                max={LoopMetadata.Constraints.MAX_SUBDIVISION_COUNT}
                step={1}
                onSetValue={(subdivisions: number) => onSetMetadata(metadata.copySetSubdivisions(subdivisions))}
            />
        </div>
    )
}

/**
 * Defines the props for the Counter component.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.9
 */
type CounterProps = {

    /**
     * The name of the counter to display.
     *
     * @since v0.0.9
     */
    name: string;

    /**
     * The initial value of the counter.
     *
     * @since v0.0.9
     */
    initial: number;

    /**
     * The minimum value of the counter.
     *
     * @since v0.0.9
     */
    min: number;

    /**
     * The maximum value of the counter.
     *
     * @since v0.0.9
     */
    max: number;

    /**
     * The step by which to change the value.
     *
     * @since v0.0.9
     */
    step: number;

    /**
     * The callback to call whenever the counter's value is updated.
     *
     * @since v0.0.9
     */
    onSetValue: (value: number) => void;
}

/**
 * Represents a Counter, a component which is responsible for changing a single
 * numeric value. This value is bounded (min and max) and can be incremented by
 * a set number each time. The value can also be edited by using the keyboard
 * to type a number. Only numbers are allowed to be typed, and invalid values
 * will be discarded. Each time the Counter is updated, the callback function
 * is called to propagate this update.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.9
 *
 * @see {@link CounterProps}
 */
function Counter({ name, initial, min, max, step, onSetValue }: CounterProps) {

    const elCounter = React.useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>;

    const [value, _setValue] = React.useState(initial);

    // blur (unfocus) listener: reset text of counter to `value` when
    // focus is lost (`value` holds the last valid value inputted)
    React.useEffect(() => {

        const counter = elCounter.current;
        const onFocusLost = () => counter.textContent = String(value);

        counter.addEventListener("blur", onFocusLost);

        return () => {
            counter.removeEventListener("blur", onFocusLost);
        }

    }, [value])

    // focus listener: select text of counter for easier editing
    React.useEffect(() => {

        const counter = elCounter.current;

        const onFocus = () => {
            let range = document.createRange();
            let selection = window.getSelection()!;

            range.setStart(counter, 0);
            range.setEnd(counter, 1);

            selection.removeAllRanges();
            selection.addRange(range);
        }

        counter.addEventListener("focus", onFocus);

        return () => {
            counter.removeEventListener("focus", onFocus);
        }
    }, [])

    // updates the value of the counter only if it is within bounds
    // (does nothing otherwise) and also calls the callback function
    const setValue = (value: number) => {
        if (value > max || value < min) {
            return;
        }

        _setValue(value);
        onSetValue(value);
    }

    const decrement = () => setValue(value - step);
    const increment = () => setValue(value + step);

    // allows only specific keys to be pressed:
    // only numbers, backspace/delete and arrow keys
    // the event is not propagated if an invalid key is pressed
    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {

        let allowedList = [
            "Delete",
            "Backspace",
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
        ];

        let allowed = (
            allowedList.includes(e.key)
            || /[0-9]/.test(e.key)
        )

        if (!allowed) {
            e.preventDefault();
        }
    }

    // updates the value of the counter with the new value of the counter
    // this is called only when a valid character has been typed
    const onInput = (newValue: string) => {
        if (newValue !== "") {
            setValue(Number(newValue));

            // move caret to the end of contenteditable text
            let range = document.createRange();
            let selection = window.getSelection()!;

            range.setStart(elCounter.current, 1);
            range.collapse(true);

            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    return (
        <div className="counter">
            <span>{name}</span>
            <Button
                text="+"
                onClick={increment}
            />
            <div
                ref={elCounter}
                className="block"
                contentEditable="plaintext-only"
                onInput={(e) => onInput((e.target as HTMLElement).textContent!)}
                onKeyDown={onKeyDown}
                suppressContentEditableWarning={true}
            >
                {value}
            </div>
            <Button
                text="-"
                onClick={decrement}
            />
        </div>
    )
}

/**
 * Defines the props for the Button component.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.9
 */
type ButtonProps = {

    /**
     * The text to display.
     *
     * @since v0.0.9
     */
    text: string;

    /**
     * The callback function which is called when the button is clicked.
     *
     * @since v0.0.9
     */
    onClick: () => void;
}

/**
 * Represents a button which displays some text. Clicking the button calls the
 * callback function. The appearance of the button changes depending on its
 * state, which can be one of: normal, hover, active.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.9
 */
function Button({ text, onClick }: ButtonProps) {
    return (
        <div className="block button" onClick={onClick}>
            {text}
        </div>
    )
}

export { MetadataController };
