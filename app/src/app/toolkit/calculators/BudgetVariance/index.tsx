import { useMode } from '../../../contexts/ModeContext'
import OpsMode from './OpsMode'
import LearningMode from './LearningMode'
export default function Calculator() {
  const { mode } = useMode()
  return mode === 'ops' ? <OpsMode /> : <LearningMode />
}
