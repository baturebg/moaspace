import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import NetworkShell from './components/layout/NetworkShell'
import WorkspacePage from './pages/workspace/WorkspacePage'
import TalentPage from './pages/talent/TalentPage'
import TradesPage from './pages/trades/TradesPage'
import CritiquePage from './pages/critique/CritiquePage'
import ContractPage from './pages/contract/ContractPage'
import VaultPage from './pages/vault/VaultPage'
import StudioPage from './pages/studio/StudioPage'
import LiveRoomPage from './pages/liveroom/LiveRoomPage'
import AudioStudioPage from './pages/audio/AudioStudioPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dark "Collaboration Nexus" shell */}
        <Route element={<AppShell />}>
          <Route index element={<WorkspacePage />} />
        </Route>

        {/* Light "Artist Network" shell */}
        <Route element={<NetworkShell />}>
          <Route path="talent" element={<TalentPage />} />
          <Route path="barters" element={<TradesPage />} />
          <Route path="studio" element={<StudioPage />} />
          <Route path="live-room" element={<LiveRoomPage />} />
          <Route path="audio-studio" element={<AudioStudioPage />} />
          <Route path="critique" element={<CritiquePage />} />
          <Route path="contract" element={<ContractPage />} />
          <Route path="vault" element={<VaultPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
