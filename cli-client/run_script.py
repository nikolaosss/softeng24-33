import subprocess

# Διαβάζουμε το αρχείο 33.sh
with open("33.sh", "r") as file:
    lines = file.readlines()

# Εκτελούμε κάθε γραμμή ξεχωριστά ως Python script
for line in lines:
    command = line.strip()
    if command:  # Αγνοούμε κενές γραμμές
        cmd_list = ["python", "se2433"] + command.split()[1:]  # Βάζουμε την Python μπροστά
        print(f"Running: {' '.join(cmd_list)}")
        subprocess.run(cmd_list)
