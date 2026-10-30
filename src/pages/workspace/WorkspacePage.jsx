import IdentityHub from './IdentityHub'
import TalentRadar from './TalentRadar'
import ArtifactShowcase from './ArtifactShowcase'
import CommsTrades from './CommsTrades'
import styles from './WorkspacePage.module.css'

// "Moa Space - Creative Collaboration Workspace" — the 4-quadrant master grid
export default function WorkspacePage() {
  return (
    <div className={styles.grid}>
      <IdentityHub />
      <TalentRadar />
      <ArtifactShowcase />
      <CommsTrades />
    </div>
  )
}
