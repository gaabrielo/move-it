import React, { useContext, useState } from 'react';
import { ChallengesContexts } from '../contexts/ChallengesContexts';

import styles from '../styles/components/Profile.module.css';

export function Profile() {
    const { level, openProfileLinkModal, profileLink, username } = useContext(ChallengesContexts);

    return (
        <div className={styles.profileContainer}>
            <img src={`${profileLink}`} alt={`${username}`} />

            <div>
                <div>
                    <strong>{username}</strong>
                    <button onClick={openProfileLinkModal}>
                        <img src="icons/edit.svg" alt="Editar perfil" />
                    </button>
                </div>

                <p>
                    <img src="icons/level.svg" alt="Level"/>
                    Level {level}
                </p>
            </div>
        </div>
    );
}
