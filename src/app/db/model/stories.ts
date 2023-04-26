import {Model} from './core';

export type StoryStatus = 'DRAFT' | 'REVIEW' | 'DONE'

export interface Story extends Model {
    modelType: 'STORY'
    title: string,
    status: StoryStatus
    draftText: string
    plotPoints: StoryPlotPoint[]
    involvedCharacters: string[]
}

export interface StoryPlotPoint {
    order: number
    description: string
}

export type StoryListView = Omit<Story, 'draftText' | 'plotPoints' | 'involvedCharacters'>
