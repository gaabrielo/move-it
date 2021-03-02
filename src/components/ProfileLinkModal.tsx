import { useContext, useState } from 'react';
import { ChallengesContexts } from '../contexts/ChallengesContexts';

import styles from '../styles/components/ProfileLinkModal.module.css';

export function ProfileLinkModal() {
    const { closeProfileLinkModal, updateProfile } = useContext(ChallengesContexts);

    const [inputProfileLinkValue, setInputProfileLinkValue] = useState('');
    const [inputUsernameValue, setInputUsernameValue] = useState('');

    function profileImageLinkListener(e) {
        setInputProfileLinkValue(e.target.value);
    }

    function usernameListener(e) {
        setInputUsernameValue(e.target.value);
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.container}>
                <label>Editar nome de usuário</label>
                <input
                    type="text"
                    placeholder="Digite seu username" 
                    required
                    onChange={usernameListener}
                />
                <p>*Obrigatório</p>

                <label htmlFor="profile-link">Editar foto de perfil</label>
                <div>
                    <input 
                        type="url"
                        name="url"
                        id="profile-link"
                        placeholder="Link da imagem"
                        onChange={profileImageLinkListener}
                    />
                    <button 
                        type="button"
                        onClick={() => updateProfile(inputProfileLinkValue.trim(), inputUsernameValue.trim())}
                    >
                        <img src="/icons/arrow-right.svg" />
                    </button>
                </div>
                <p>*Caso a foto não seja exibida tente inserir um link válido</p>

                <button type="button" onClick={closeProfileLinkModal}>
                    <img src="/icons/close.svg" alt="Fechar modal"/>
                </button>
            </div>
        </div>
    )
}
