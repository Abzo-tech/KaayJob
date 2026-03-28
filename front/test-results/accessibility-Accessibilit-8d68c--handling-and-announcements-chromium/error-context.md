# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications alt+T"
  - generic [ref=e8]:
    - generic [ref=e9]:
      - heading "KaayJob" [level=1] [ref=e10]
      - paragraph [ref=e11]: Connectez-vous avec des prestataires de confiance
    - generic [ref=e12]:
      - heading "Connexion" [level=4] [ref=e14]
      - generic [ref=e16]:
        - tablist [ref=e17]:
          - tab "Client" [selected] [ref=e18] [cursor=pointer]
          - tab "Prestataire" [ref=e19] [cursor=pointer]
          - tab "Admin" [ref=e20] [cursor=pointer]
        - tabpanel "Client" [ref=e21]:
          - generic [ref=e22]:
            - tablist [ref=e23]:
              - tab "Connexion" [selected] [ref=e24] [cursor=pointer]
              - tab "S'inscrire" [ref=e25] [cursor=pointer]
            - tabpanel "Connexion" [ref=e26]:
              - generic [ref=e27]:
                - generic [ref=e28]:
                  - generic [ref=e29]: Email
                  - textbox "Email" [ref=e30]:
                    - /placeholder: exemple@email.com
                - generic [ref=e31]:
                  - generic [ref=e32]: Mot de passe
                  - textbox "Mot de passe" [ref=e33]:
                    - /placeholder: " minimum 8 caractères"
                  - button [ref=e34] [cursor=pointer]:
                    - img [ref=e35]
                - button "Connexion" [ref=e38] [cursor=pointer]
    - button "← Retour à l'Accueil" [ref=e40] [cursor=pointer]
```