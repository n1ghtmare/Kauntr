import * as React from "react";
import * as classNames from "classnames";

interface LoadingIndicatorProps {
    isActive: boolean;
    isTiny?: boolean;
    className?: string;
}

export default class LoadingIndicator extends React.Component<LoadingIndicatorProps, any> {
    public static defaultProps: Partial<LoadingIndicatorProps> = {
        className: "loader",
        isTiny: false
    };

    private loaderMessages: Array<string> = [
        "Reticulating splines...",
        "Generating witty dialog...",
        "Swapping time and space...",
        "Spinning violently around the y-axis...",
        "Tokenizing real life...",
        "Bending the spoon...",
        "Don't think of purple hippos...",
        "We need a new fuse...",
        "Have a good day.",
        "640K ought to be enough for anybody",
        "The architects are still drafting",
        "The bits are breeding",
        "We're building the buildings as fast as we can",
        "Would you prefer chicken, steak, or tofu?",
        "(Pay no attention to the man behind the curtain)",
        "Please wait while the little elves draw your map",
        "Don't worry - a few bits tried to escape, but we caught them",
        "Would you like fries with that?",
        "Go ahead -- hold your breath!",
        "...at least you're not on hold...",
        "Hum something loud while others stare",
        "The server is powered by a lemon and two electrodes.",
        "Please wait while a larger software vendor in Seattle takes over the world",
        "We're testing your patience",
        "As if you had any other choice",
        "Follow the white rabbit",
        "Why don't you order a sandwich?",
        "While the satellite moves into position",
        "keep calm and npm install",
        "The bits are flowing slowly today",
        "It's still faster than you could draw it",
        "The last time I tried this the monkey didn't survive. Let's hope it works better this time.",
        "I should have had a V8 this morning.",
        "My other loading screen is much faster.",
        "Reconfoobling energymotron...",
        "Are we there yet?",
        "Just count to 10",
        "Why so serious?",
        "It's not you. It's me.",
        "Counting backwards from Infinity",
        "Don't panic...",
        "Do you come here often?",
        "We're making you a cookie.",
        "Creating time-loop inversion field",
        "Spinning the wheel of fortune...",
        "Loading the enchanted bunny...",
        "Computing chance of success",
        "I'm sorry Dave, I can't do that.",
        "Looking for exact change",
        "All your web browser are belong to us",
        "All I really need is a kilobit.",
        "I feel like im supposed to be loading something. . .",
        "What do you call 8 Hobbits? A Hobbyte.",
        "Should have used a compiler language...",
        "Adjusting flux capacitor...",
        "Please wait until the sloth starts moving.",
        "Don't break your screen yet!",
        "I swear it's almost done.",
        "Let's take a mindfulness minute...",
        "Keeping all the 1's and removing all the 0's...",
        "Putting the icing on the cake. The cake is not a lie...",
        "Cleaning off the cobwebs...",
        "Making sure all the i's have dots...",
        "Connecting Neurotoxin Storage Tank...",
        "Granting wishes...",
        "We are not liable for any broken screens as a result of waiting.",
        "Time flies when you’re having fun.",
        "Get some coffee and come back in ten minutes..",
        "Spinning the hamster…",
        "Stay awhile and listen..",
        "Be careful not to step in the git-gui",
        "You shall not pass! yet..",
        "Load it and they will come",
        "Convincing AI not to turn evil..",
        "There is no spoon. Because we are not done loading it",
        "Your left thumb points to the right and your right thumb points to the left.",
        "How did you get here?",
        "Wait, do you smell something burning?",
        "Computing the secret to life, the universe, and everything.",
        "When nothing is going right, Go left!!...",
        "I love my job only when I'm on vacation...",
        "i'm not lazy, I'm just relaxed!!",
        "Why are they called apartments if they are all stuck together?",
        "Optimism – is a lack of information.....",
        "Save water and shower together",
        "Whenever I find the key to success, someone changes the lock.",
        "I’ve got problem for your solution…..",
        "Where there’s a will, there’s a relative.",
        "I think I am, therefore, I am. I think.",
        "git happens",
        "May the forks be with you",
        "This is not a joke, it's a commit.",
        "Constructing additional pylons...",
        "We are not liable for any broken screens as a result of waiting.",
        "Hello IT, have you tried turning it off and on again?",
        "Well, this is embarrassing.",
        "What is the airspeed velocity of an unladen swallow?",
        "Hello, IT... Have you tried forcing an unexpected reboot?",
        "They just toss us away like yesterday's jam.",
        "They're fairly regular, the beatings, yes. I'd say we're on a bi-weekly beating.",
        "The Elders of the Internet would never stand for it.",
        "Space is invisible mind dust, and stars are but wishes.",
        "Didn't know paint dried so quickly.",
        "Everything sounds the same",
        "I'm going to walk the dog",
        "I didn't choose the engineering life. The engineering life chose me.",
        "Dividing by zero...",
        "Spawn more Overlord!",
        "Some days, you just can’t get rid of a bug!",
        "We’re going to need a bigger boat.",
        "Web developers do it with <style>",
        "Cracking military-grade encryption...",
        "Simulating traveling salesman...",
        "Proving P=NP...",
        "Entangling superstrings...",
        "Twiddling thumbs...",
        "Searching for plot device...",
        "Trying to sort in O(n)...",
        "Sending data to NS-i mean, our servers.",
        "Looking for sense of humour, please hold on.",
        "Please wait while the intern refills his coffee.",
        "A different error message? Finally, some progress!",
        "Hold on while we wrap up our git together...sorry",
        "Please hold on as we reheat our coffee",
        "Kindly hold on as we convert this bug to a feature...",
        "Kindly hold on as our intern quits vim...",
        "Winter is coming...",
        "Installing dependencies",
        "Switching to the latest JS framework",
        "Distracted by cat gifs",
        "Finding someone to hold my beer",
        "BRB, working on my side project",
        "@todo Insert witty loading message",
        "Let's hope it's worth the wait",
        "Aw, snap! Not..",
        "Ordering 1s and 0s...",
        "Updating dependencies...",
        "Whatever you do, don't look behind you...",
        "Please wait... Consulting the manual...",
        "Loading funny message...",
        "It's 10:00pm. Do you know where your children are?",
        "Feel free to spin in your chair",
        "format C: ...",
        "Bored of slow loading spinner, buy more RAM!",
        "Help, I'm trapped in a loader!"
    ];

    renderFullSize() {
        return (
            <div className={classNames(this.props.className, { "hidden": !this.props.isActive })}>
                <img src="/Content/images/loader-pendulum.gif" />
                <div className="loader-message">
                    {this.loaderMessages[Math.floor(Math.random() * this.loaderMessages.length)]}
                </div>
            </div>
        );

    }

    renderTiny() {
        return (
            <div className={classNames({ "hidden": !this.props.isActive })}>
                {this.loaderMessages[Math.floor(Math.random() * this.loaderMessages.length)]}
            </div>
        );
    }

    render() {
        return this.props.isTiny ? this.renderTiny() : this.renderFullSize();
    }
}