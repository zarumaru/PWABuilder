import {
  ListHeader,
  ProgressList,
  RawTestResult,
  Status,
} from '../utils/interfaces';
import { getManifest } from './manifest';
import { getChosenServiceWorker } from './service_worker';

let site_url: string | undefined;
let results: RawTestResult | undefined;
let wasPWA: boolean | undefined;

let progress: ProgressList = {
  progress: [
    {
      header: ListHeader.TEST,
      location: '/',
      done: Status.ACTIVE,
      items: [
        {
          name: 'Submit URL',
          done: Status.PENDING,
        },
        {
          name: 'Run Tests',
          done: Status.PENDING,
        },
      ],
    },
    {
      header: ListHeader.REVIEW,
      location: '/reportcard',
      done: Status.PENDING,
      items: [
        {
          name: 'Manifest',
          done: Status.PENDING,
        },
        {
          name: 'Service Worker',
          done: Status.PENDING,
        },
        {
          name: 'Security',
          done: Status.PENDING,
        },
      ],
    },
    {
      header: ListHeader.PUBLISH,
      location: '/publish',
      done: Status.PENDING,
      items: [
        {
          name: 'Package',
          done: Status.PENDING,
        },
        {
          name: 'Publish',
          done: Status.PENDING,
        },
      ],
    },
    {
      header: ListHeader.COMPLETE,
      location: '/complete',
      done: Status.PENDING,
      items: [
        {
          name: 'Resources',
          done: Status.PENDING,
        },
      ],
    },
  ],
};

export function getProgress(): ProgressList {
  const current_progress = sessionStorage.getItem('current_progress');

  if (current_progress) {
    return <ProgressList>JSON.parse(current_progress);
  } else {
    return progress;
  }
}

export function setProgress(newProgress: ProgressList) {
  progress = newProgress;
  sessionStorage.setItem('current_progress', JSON.stringify(progress));
}

export function setURL(url: string) {
  site_url = url;
  sessionStorage.setItem('current_url', site_url);
}

export function getURL() {
  if (site_url) {
    return site_url;
  } else {
    const url = sessionStorage.getItem('current_url');

    return url || undefined;
  }
}

export function setResults(testResults: RawTestResult) {
  console.log('testResults', testResults);
  results = testResults;
  sessionStorage.setItem('current_results', JSON.stringify(testResults));
}

export function getResults(): RawTestResult | undefined {
  if (results) {
    return results;
  } else {
    const testResults = sessionStorage.getItem('current_results');

    if (testResults) {
      const parsedResults = <RawTestResult>JSON.parse(testResults);
      return parsedResults;
    } else {
      return undefined;
    }
  }
}

export function baseOrPublish(): 'base' | 'publish' {
  const choseSW = getChosenServiceWorker();
  
  const manifestData = getManifest();

  console.log('manidata', manifestData);

  if (choseSW !== undefined) {
    // User has chosen a custom service worker
    // send to basepackage to download.
    // to-do: Users who edit their manifest will be sent here too
    return 'base';
  }
  else if (manifestData) {
    // User already has a manifest
    // send to publish page
    return 'publish';
  }
  else {
    // user does not have a manifest and has not chosen an SW
    // They will go to the base package page and will need to download
    // The generated manifest and default SW
    return 'base';
  }
}