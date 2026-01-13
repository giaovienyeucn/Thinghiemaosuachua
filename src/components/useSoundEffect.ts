import { useCallback, useRef, useEffect } from 'react';

type SoundType = 'pour' | 'stir' | 'success' | 'drop' | 'complete';

// URLs for sound effects
const soundUrls: Record<SoundType, string> = {
    pour: 'https://assets.mixkit.co/active_storage/sfx/2496/2496-preview.mp3',
    stir: 'https://assets.mixkit.co/active_storage/sfx/2505/2505-preview.mp3',
    success: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
    drop: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
    // Âm thanh fanfare/celebration rõ ràng hơn
    complete: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3',
};

export function useSoundEffect() {
    const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

    // Preload all sounds on mount
    useEffect(() => {
        Object.entries(soundUrls).forEach(([type, url]) => {
            const audio = new Audio(url);
            audio.volume = 1.0;
            audio.preload = 'auto';
            audioRefs.current[type] = audio;
        });
    }, []);

    const play = useCallback((type: SoundType) => {
        try {
            const audio = audioRefs.current[type];
            if (audio) {
                audio.currentTime = 0;
                audio.play().catch((err) => {
                    console.log('Audio play failed:', err);
                });
            }
        } catch (err) {
            console.log('Sound error:', err);
        }
    }, []);

    return { play };
}
