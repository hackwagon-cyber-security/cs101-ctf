FROM wordpress:php7.4-apache

# Add non-privileged user with sudo privilege escalation misconfiguration
RUN apt-get update \
    && apt-get install -y sudo vim python3 \
    && rm -rf /var/cache/apt/*

RUN echo "cs101-ctf{A6F0D2862863FFD2D19D72F55D3B0348}" > /tmp/flag \
    && chown www-data:www-data /tmp/flag \
    && chmod 755 /tmp/flag

RUN useradd hackwagon -m -s /bin/bash \
    && echo 'hackwagon:hackwagon123' | chpasswd \
    && echo "hackwagon ALL=(root) /usr/bin/vim" >> /etc/sudoers \
    && echo "cs101-ctf{56E0EB17948DB511ECEF36563088B837}" > /home/hackwagon/flag \
    && chown hackwagon:hackwagon /home/hackwagon/flag \
    && chmod 400 /home/hackwagon/flag

RUN echo "cs101-ctf{BFE8BC396F931414D2CC68BA85EE2CEA}" > /root/flag \
    && chown root:root /root/flag \
    && chmod 400 /root/flag