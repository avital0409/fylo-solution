const TOTAL_DISK_SPACE = 100 * 1024 * 1024;
const DEFAULT_USAGE = 85 * 1024 * 1024;
const CACHE_CURRENT_USAGE = 'currentUsage';
const PICKER_OPTS = {
  multiple: true,
};
let CURRENT_USAGE;

const initApp = () => {
  CURRENT_USAGE = parseInt(localStorage[CACHE_CURRENT_USAGE]) || DEFAULT_USAGE;

  document.addEventListener('DOMContentLoaded', function () {
    const updateStorageLimitElement = () => {
      document.getElementById('storage-limit').innerHTML = getSizeString(TOTAL_DISK_SPACE);
    }

    updateStorageLimitElement();
    updateUsageDomElements();
  });
}

const getFile = async () => {
  const isFileFormatValid = (fileType) => {
    const FILE_PATTERN = /jpg|jpeg|gif|png/;

    if (FILE_PATTERN.test(fileType)) {
      return true;
    } else {
      return false;
    }
  }

  const isThereEnoughStorageLeft = (fileSize) => {
    return CURRENT_USAGE + fileSize <= TOTAL_DISK_SPACE;
  }

  const storeFile = (file) => {
    CURRENT_USAGE += file.size;
    localStorage[CACHE_CURRENT_USAGE] = CURRENT_USAGE;
  }

  const fileHandles = await window.showOpenFilePicker(PICKER_OPTS);

  for (const fileHandle of fileHandles) {
    const file = await fileHandle.getFile();

    if (!isFileFormatValid(file.type)) {
      alert("File format isn't supported");
      return;
    }

    if (isThereEnoughStorageLeft(file.size)) {
      storeFile(file);
      updateUsageDomElements();
    } else {
      alert('There is not enough space on the disk');
    }
  }
}

const updateUsageDomElements = () => {
  const updateStorageLeftElement = () => {
    const prettifiedStorageLeft = getPrettifiedFileSize(TOTAL_DISK_SPACE - CURRENT_USAGE);
    document.getElementById('storage-left').innerHTML = prettifiedStorageLeft.size + '&nbsp;<span>' + prettifiedStorageLeft.units + '&nbsp;left</span> ';
  }

  const updateStorageUsageElement = () => {
    document.getElementById('storage-usage').innerHTML = getSizeString(CURRENT_USAGE);
  }

  const updateBarElement = () => {
    const getUsagePercentage = () => {
      return (Math.round((CURRENT_USAGE / TOTAL_DISK_SPACE) * 100)) + '%';
    }

    document.getElementsByClassName('gradient-bar')[0].style.width = getUsagePercentage();
  }

  updateStorageUsageElement();
  updateStorageLeftElement();
  updateBarElement();
}

const getSizeString = (sizeInBytes) => {
  const prettifiedSize = getPrettifiedFileSize(sizeInBytes);
  return prettifiedSize.size + prettifiedSize.units;
}

const getPrettifiedFileSize = (sizeInBytes) => {
  let i = -1;
  let byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];

  do {
    sizeInBytes /= 1024;
    i++;
  } while (sizeInBytes > 1024);

  return { size: Math.max(sizeInBytes, 0.1).toFixed(0), units: byteUnits[i] };
}

initApp();