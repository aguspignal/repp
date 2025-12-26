import { Session } from '@supabase/supabase-js';
import { StatusBar } from 'expo-status-bar';
import { supabase } from './src/lib/supabase';
import { useEffect, useState } from 'react';
import LoginNavigator from './src/navigation/LoginNavigator';
import Root from './src/navigation/Root';

export default function Main() {
	const [currentSession, setCurrentSession] = useState<Session | null>(null)
    
	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setCurrentSession(session)
		})

		supabase.auth.onAuthStateChange((_event, session) => {
			setCurrentSession(session)
		})
	}, [])

	return (
		<>
			<StatusBar style="light" />
			{currentSession ? <Root uuid={currentSession.user.id} /> : <LoginNavigator />}
		</>
	)
}