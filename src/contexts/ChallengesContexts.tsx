import React, { createContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import challenges from '../../challenges.json';
import { LevelUpModal } from '../components/LevelUpModal';
import { ProfileLinkModal } from '../components/ProfileLinkModal';

interface Challenge {
    type: 'body' | 'eye',
    description: string,
    amount: number
}

interface ChallengesContextData {
    level: number;
    currentExperience: number;
    challengesCompleted: number;
    activeChallenge: Challenge;
    levelUp: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;
    experienceToNextLevel: number;
    completeChallenge: () => void;
    closeLevelUpModal: () => void;
    closeProfileLinkModal: () => void;
    openProfileLinkModal: () => void;
    updateProfile: (link: string, name: string) => void;
    profileLink: string;
    username: string;
}

interface ChallengesProviderProps {
    children: ReactNode;
    level: number;
    currentExperience: number;
    challengesCompleted: number;
}

export const ChallengesContexts = createContext({} as ChallengesContextData);

export function ChallengesProvider({ 
    children,
    ...rest
}: ChallengesProviderProps) {
    const [level, setLevel] = useState(rest.level ?? 1);
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0);
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0);

    const [username, setUsername] = useState('Seu nome');
    const [profileLink, setProfileLink] = useState('logo-full.svg');

    const [activeChallenge, setActiveChallenge] = useState(null);
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
    const [isProfileLinkModalOpen, setProfileLinkModalOpen] = useState(false);

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2)

    // useEffect com segundo parâmetro vazio é executado uma única vez quando componente é renderizado
    useEffect(() => {
        Notification.requestPermission();
    }, [])

    useEffect(() => {
        Cookies.set('level', String(level));
        Cookies.set('currentExperience', String(currentExperience));
        Cookies.set('challengesCompleted', String(challengesCompleted));
    }, [level, currentExperience, challengesCompleted]);

    function updateProfile(link: string, name: string) {
        if ( name === '' && username !== '' ) {
            setProfileLinkModalOpen(false);
        } else {
            setUsername(name);
        }

        if ( link === '' && profileLink !== '' ) {
            setProfileLinkModalOpen(false);
        } else {
            setProfileLink(link);
        }
        setProfileLinkModalOpen(false);
    }

    function openProfileLinkModal() {
        setProfileLinkModalOpen(true);
    }

    function closeProfileLinkModal() {
        setProfileLinkModalOpen(false);
    }

    function closeLevelUpModal() {
        setIsLevelUpModalOpen(false);
    }

    function levelUp() {
        setLevel(level + 1);
        setIsLevelUpModalOpen(true);
    }

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex];
        setActiveChallenge(challenge);
        
        new Audio('/notification.mp3').play();

        if ( Notification.permission === 'granted' ) {
            new Notification('Novo desafio 🎉', {
                body: `Valendo ${challenge.amount} xp!`,
                icon: '/favicon.png'
            })
        }
    }

    function resetChallenge() {
        setActiveChallenge(null);
    }

    function completeChallenge() {
        if ( !activeChallenge ) {
            return;
        }

        const { amount } = activeChallenge;

        // let it change
        let finalExperience = currentExperience + amount;

        if ( finalExperience >= experienceToNextLevel ) {
            finalExperience = finalExperience - experienceToNextLevel;
            levelUp();
        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);
    }

    return (
        <ChallengesContexts.Provider 
            value={{ 
                level,
                currentExperience,
                challengesCompleted,
                levelUp,
                startNewChallenge,
                activeChallenge,
                resetChallenge,
                experienceToNextLevel,
                completeChallenge,
                closeLevelUpModal,
                closeProfileLinkModal,
                openProfileLinkModal,
                updateProfile,
                profileLink,
                username,
            }}
        >
            {children}

            { isLevelUpModalOpen && <LevelUpModal /> }
            { isProfileLinkModalOpen && <ProfileLinkModal /> }
        </ChallengesContexts.Provider>
    );
}
