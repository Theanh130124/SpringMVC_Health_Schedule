"use strict";
/*
    Installed from https://reactbits.dev/ts/default/
*/
"use client";
/*
    Installed from https://reactbits.dev/ts/default/
*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const framer_motion_1 = require("framer-motion");
require("./RotatingText.css");
function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}
const RotatingText = (0, react_1.forwardRef)((props, ref) => {
    const { texts, transition = { type: "spring", damping: 25, stiffness: 300 }, initial = { y: "100%", opacity: 0 }, animate = { y: 0, opacity: 1 }, exit = { y: "-120%", opacity: 0 }, animatePresenceMode = "wait", animatePresenceInitial = false, rotationInterval = 2000, staggerDuration = 0, staggerFrom = "first", loop = true, auto = true, splitBy = "characters", onNext, mainClassName, splitLevelClassName, elementLevelClassName } = props, rest = __rest(props, ["texts", "transition", "initial", "animate", "exit", "animatePresenceMode", "animatePresenceInitial", "rotationInterval", "staggerDuration", "staggerFrom", "loop", "auto", "splitBy", "onNext", "mainClassName", "splitLevelClassName", "elementLevelClassName"]);
    const [currentTextIndex, setCurrentTextIndex] = (0, react_1.useState)(0);
    const splitIntoCharacters = (text) => {
        if (typeof Intl !== "undefined" && Intl.Segmenter) {
            const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
            return Array.from(segmenter.segment(text), (segment) => segment.segment);
        }
        return Array.from(text);
    };
    const elements = (0, react_1.useMemo)(() => {
        const currentText = texts[currentTextIndex];
        if (splitBy === "characters") {
            const words = currentText.split(" ");
            return words.map((word, i) => ({
                characters: splitIntoCharacters(word),
                needsSpace: i !== words.length - 1,
            }));
        }
        if (splitBy === "words") {
            return currentText.split(" ").map((word, i, arr) => ({
                characters: [word],
                needsSpace: i !== arr.length - 1,
            }));
        }
        if (splitBy === "lines") {
            return currentText.split("\n").map((line, i, arr) => ({
                characters: [line],
                needsSpace: i !== arr.length - 1,
            }));
        }
        // For a custom separator
        return currentText.split(splitBy).map((part, i, arr) => ({
            characters: [part],
            needsSpace: i !== arr.length - 1,
        }));
    }, [texts, currentTextIndex, splitBy]);
    const getStaggerDelay = (0, react_1.useCallback)((index, totalChars) => {
        const total = totalChars;
        if (staggerFrom === "first")
            return index * staggerDuration;
        if (staggerFrom === "last")
            return (total - 1 - index) * staggerDuration;
        if (staggerFrom === "center") {
            const center = Math.floor(total / 2);
            return Math.abs(center - index) * staggerDuration;
        }
        if (staggerFrom === "random") {
            const randomIndex = Math.floor(Math.random() * total);
            return Math.abs(randomIndex - index) * staggerDuration;
        }
        return Math.abs(staggerFrom - index) * staggerDuration;
    }, [staggerFrom, staggerDuration]);
    const handleIndexChange = (0, react_1.useCallback)((newIndex) => {
        setCurrentTextIndex(newIndex);
        if (onNext)
            onNext(newIndex);
    }, [onNext]);
    const next = (0, react_1.useCallback)(() => {
        const nextIndex = currentTextIndex === texts.length - 1
            ? loop
                ? 0
                : currentTextIndex
            : currentTextIndex + 1;
        if (nextIndex !== currentTextIndex) {
            handleIndexChange(nextIndex);
        }
    }, [currentTextIndex, texts.length, loop, handleIndexChange]);
    const previous = (0, react_1.useCallback)(() => {
        const prevIndex = currentTextIndex === 0
            ? loop
                ? texts.length - 1
                : currentTextIndex
            : currentTextIndex - 1;
        if (prevIndex !== currentTextIndex) {
            handleIndexChange(prevIndex);
        }
    }, [currentTextIndex, texts.length, loop, handleIndexChange]);
    const jumpTo = (0, react_1.useCallback)((index) => {
        const validIndex = Math.max(0, Math.min(index, texts.length - 1));
        if (validIndex !== currentTextIndex) {
            handleIndexChange(validIndex);
        }
    }, [texts.length, currentTextIndex, handleIndexChange]);
    const reset = (0, react_1.useCallback)(() => {
        if (currentTextIndex !== 0) {
            handleIndexChange(0);
        }
    }, [currentTextIndex, handleIndexChange]);
    (0, react_1.useImperativeHandle)(ref, () => ({
        next,
        previous,
        jumpTo,
        reset,
    }), [next, previous, jumpTo, reset]);
    (0, react_1.useEffect)(() => {
        if (!auto)
            return;
        const intervalId = setInterval(next, rotationInterval);
        return () => clearInterval(intervalId);
    }, [next, rotationInterval, auto]);
    return (<framer_motion_1.motion.span className={cn("text-rotate", mainClassName)} {...rest} layout transition={transition}>
        <span className="text-rotate-sr-only">{texts[currentTextIndex]}</span>
        <framer_motion_1.AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
          <framer_motion_1.motion.div key={currentTextIndex} className={cn(splitBy === "lines" ? "text-rotate-lines" : "text-rotate")} layout aria-hidden="true">
            {elements.map((wordObj, wordIndex, array) => {
            const previousCharsCount = array
                .slice(0, wordIndex)
                .reduce((sum, word) => sum + word.characters.length, 0);
            return (<span key={wordIndex} className={cn("text-rotate-word", splitLevelClassName)}>
                  {wordObj.characters.map((char, charIndex) => (<framer_motion_1.motion.span key={charIndex} initial={initial} animate={animate} exit={exit} transition={Object.assign(Object.assign({}, transition), { delay: getStaggerDelay(previousCharsCount + charIndex, array.reduce((sum, word) => sum + word.characters.length, 0)) })} className={cn("text-rotate-element", elementLevelClassName)}>
                      {char}
                    </framer_motion_1.motion.span>))}
                  {wordObj.needsSpace && (<span className="text-rotate-space"> </span>)}
                </span>);
        })}
          </framer_motion_1.motion.div>
        </framer_motion_1.AnimatePresence>
      </framer_motion_1.motion.span>);
});
RotatingText.displayName = "RotatingText";
exports.default = RotatingText;
