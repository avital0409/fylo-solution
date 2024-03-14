const filePattern = /jpg|jpeg|gif|png/;
const mbSizeInBytes = 1024 * 1024;
const totalDiskSpace = mbsToBytes(100);
const defaultUsage = mbsToBytes(85);
let currentUsage = parseInt(localStorage['currentUsage']) || defaultUsage;
const mbText = ' MB';
const pickerOpts = {
    multiple: true,
};

async function getFile() {
    const fileHandles = await window.showOpenFilePicker(pickerOpts);

    for (const fileHandle of fileHandles) {
        const file = await fileHandle.getFile();

        if (!filePattern.test(file.type)) {
            alert("File format isn't supported");
            return;
        }

        if (currentUsage + file.size <= totalDiskSpace) {
            currentUsage += file.size;
            localStorage['currentUsage'] = currentUsage;
            updateUsageDomElements();
        } else {
            alert('There is not enough space on the disk');
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('mb-limit').innerHTML = bytesToMbs(totalDiskSpace) + mbText;
    updateUsageDomElements();
});

function updateUsageDomElements() {
    document.getElementById('mb-usage').innerHTML = bytesToMbs(currentUsage) + mbText;
    document.getElementById('mb-left').innerHTML = bytesToMbs(totalDiskSpace - currentUsage) + '&nbsp;<span>MB left</span> ';
    document.getElementsByClassName('gradient-bar')[0].style.width = getUsagePercentage();
}

function getUsagePercentage() {
    return (Math.round((currentUsage / totalDiskSpace) * 100)) + '%';
}

function bytesToMbs(size) {
    return Math.round(size / mbSizeInBytes);
}

function mbsToBytes(size) {
    return size * mbSizeInBytes;
}