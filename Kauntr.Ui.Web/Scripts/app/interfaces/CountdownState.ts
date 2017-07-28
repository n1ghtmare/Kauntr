interface CountdownState {
    isCreatingNew: boolean;

    // TODO - add rest of individual countdown properties (loading, description, endsOn etc.)

    dispatch?: Function;
}

export default CountdownState;