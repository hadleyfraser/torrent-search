/*
  null none task
  0 task is queuing
  1 task is paused
  2 task is stopped
  3 task is move downloaded files
  4 task is failed
  5 task is finished
  100 task is finished but still in sharing
  101 task is queue in engine and doing check
  102 task is checking files
  103 task is downloading from magnet link
  104 task is downloading
*/
enum taskStatus {
  "no_status" = null,
  "queuing" = 0,
  "paused" = 1,
  "stopped" = 2,
  "moving" = 3,
  "failed" = 4,
  "finished" = 5,
  "sharing" = 100,
  "queue-check" = 101,
  "checking" = 102,
  "magnet_download" = 103,
  "non_magnet_download" = 104
}

export { taskStatus };
