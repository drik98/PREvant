import type { Service } from '~/generated/types/prevant'

export enum AppState {
  starting = 'starting',
  stopping = 'stopping',
  running = 'running',
}

export interface App {
  appName: string
  state: AppState
  services?: Service[]
}
