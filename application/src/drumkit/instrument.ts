/**
 * @fileoverview Defines the {@link Instrument} class, which encapsulates the
 * a musical instrument which can be used to play a sound. To conveniently
 * manage the different instruments which the user will create, the
 * {@link InstrumentManager} can be used which hides the individual instrument
 * objects and allows controlled interaction with them.
 */

/**
 * Defines a musical instrument which can be used to play a sound.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.1
 */
class Instrument {

    constructor(
        public readonly id: number,
        public readonly displayName: string,
    ) { }

    play() {
        console.log(`Playing ${this.displayName}`);
    }
}

/**
 * Defines the type of the callback which is called when a new instrument is
 * created in an instrument manager.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.4
 *
 * @see {@link InstrumentManager}.
 */
type CreateInstrumentListener = (instrumentId: number) => void;

/**
 * Defines the type of the callback which is called when an existing instrument
 * is deleted from an instrument manager.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.4
 *
 * @see {@link InstrumentManager}.
 */
type DeleteInstrumentListener = (instrumentId: number) => void;

/**
 * Defines a manager for instruments, which conveniently abstracts away the
 * individual instrument objects allowing only select and controlled
 * interactions with them.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.4
 */
class InstrumentManager {

    private readonly createInstrumentListeners: Set<CreateInstrumentListener> = new Set();
    private readonly deleteInstrumentListeners: Set<DeleteInstrumentListener> = new Set();

    /**
     * Adds a listener for the "create instrument" event to this manager. It is
     * called when a new instrument is created, with the new instrument's ID as
     * the parameter.
     *
     * @param {CreateInstrumentListener} listener the listener to add
     *
     * @see {@link CreateInstrumentListener}.
     *
     * @since v0.0.4
     */
    addCreateInstrumentListener(listener: CreateInstrumentListener) {
        this.createInstrumentListeners.add(listener);
    }

    /**
     * Removes a listener for the "create instrument" from this manager.
     *
     * @param {CreateInstrumentListener} listener the listener to remove
     * @returns {boolean} true if the listener existed and was removed, false
     * otherwise
     *
     * @since v0.0.4
     */
    removeCreateInstrumentListener(listener: CreateInstrumentListener): boolean {
        return this.createInstrumentListeners.delete(listener);
    }

    /**
     * Adds a listener for the "delete instrument" event to this manager. It is
     * called when an existing instrument is deleted, with the instrument's ID
     * as the parameter.
     *
     * @param {DeleteInstrumentListener} listener the listener to add
     *
     * @see {@link DeleteInstrumentListener}.
     *
     * @since v0.0.4
     */
    adddeleteInstrumentListener(listener: DeleteInstrumentListener) {
        this.deleteInstrumentListeners.add(listener);
    }

    /**
     * Removes a listener for the "delete instrument" from this manager.
     *
     * @param {DeleteInstrumentListener} listener the listener to remove
     * @returns {boolean} true if the listener existed and was removed, false
     * otherwise
     *
     * @since v0.0.4
     */
    removedeleteInstrumentListener(listener: DeleteInstrumentListener): boolean {
        return this.deleteInstrumentListeners.delete(listener);
    }

    private readonly instruments: Map<number, Instrument> = new Map();

    /**
     * Returns the IDs of the instruments in this manager as an array, sorted
     * according to a function.
     *
     * @param {?((a: number, b: number) => number)} [compareFn] the function
     * used to compare the IDs of the instruments. For arguments `a` and `b` it
     * is expected to return a negative number if `a < b`, zero if `a == b` and
     * a positive number if `a > b`. If it is undefined, the array is sorted in
     * ascending, numeric, order.
     * @returns {number[]} the array of IDs
     *
     * @since v0.0.4
     */
    getSortedIds(compareFn?: ((a: number, b: number) => number)): number[] {
        compareFn ??= (a, b) => a - b;
        return Array.from(this.instruments.keys()).sort(compareFn);
    }

    /**
     * Creates a new instrument with the given display name and calls the
     * listeners for the "create instrument" event.
     *
     * @param {string} displayName the display name for the new instrument
     * @returns {number} the id of the newly created instrument
     *
     * @since v0.0.4
     */
    create(displayName: string): number {
        let maxId = this.getSortedIds().at(-1);
        let newId = maxId === undefined ? 0 : maxId + 1;

        const instrument = new Instrument(newId, displayName);
        this.instruments.set(newId, instrument);

        this.createInstrumentListeners.forEach(l => l(newId));

        return newId;
    }

    /**
     * Deletes the existing instrument with the given id and calls the
     * listeners for the "delete instrument" event.
     *
     * @param {number} id the id of the instrument to delete
     *
     * @throws {Error} if no instrument with the given id exists
     *
     * @since v0.0.4
     */
    delete(id: number) {
        // make sure it exists; `get()` will throw if it doesn't
        this.get(id);

        this.instruments.delete(id);

        this.deleteInstrumentListeners.forEach(l => l(id));
    }

    /**
     * Returns the instrument with the given id.
     *
     * @param {number} id the id of the instrument
     * @returns {Instrument} the instrument with the given id
     *
     * @throws {Error} if no instrument with the given id exists
     */
    private get(id: number): Instrument {
        if (!this.instruments.has(id)) {
            throw new Error(`Invalid instrument id: ${id}`);
        }

        return this.instruments.get(id)!;
    }

    /**
     * Returns the display name of the instrument with the given id.
     *
     * @param {number} id the id of the instrument
     * @returns {string} the display name of the instrument with that id
     *
     * @throws {Error} if no instrument with the given id exists
     *
     * @since v0.0.4
     */
    getDisplayName(id: number): string {
        return this.get(id).displayName;
    }

    /**
     * Plays the instrument with the given id according to a value.
     *
     * @param {number} id the id of the instrument to play
     * @param {number} value the value used to determine whether the instrument
     * will actually play. A value of 1 means that the instrument will play.
     * All other values indicate that it will not.
     *
     * @throws {Error} if no instrument with the given id exists, regardless of
     * the value. This method will throw even if the instrument doesn't play.
     *
     * @since v0.0.4
     */
    play(id: number, value: number) {
        let instrument = this.get(id);

        if (value === 1) {
            instrument.play();
        }
    }
}

export { InstrumentManager };

export type { CreateInstrumentListener, DeleteInstrumentListener };
