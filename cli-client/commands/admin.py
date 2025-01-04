import requests

def admin(args=None):
    """Υπομνημα Admin και εκτέλεση των σχετικών εντολών."""
    if not args:
        # Εμφάνιση των δικαιωμάτων admin αν δεν δόθηκαν επιχειρήματα
        print("""
        Ως admin έχετε τα παρακάτω δικαιώματα:
        1. --usermod: Δημιουργία νέου χρήστη ή αλλαγή password
           Υποχρεωτικές παράμετροι: --username, --passw
        2. --users: Εμφάνιση λίστας με usernames
        3. --addpasses: Προσθήκη νέων διελεύσεων από αρχείο CSV
           Υποχρεωτική παράμετρος: --source (όνομα αρχείου με διελεύσεις)
        """)
        return

    # Εκτέλεση της κατάλληλης λειτουργίας admin
    if args.username and args.passw:
        admin_usermod(args.username, args.passw)
    elif args.source:
        admin_addpasses(args.source)
    else:
        admin_users()
