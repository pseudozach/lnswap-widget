# 1⃣ Prepare Operating System

{% hint style="success" %}
If you already have an available laptop/self-hosted node with an operating system, you can skip to [Install Nodes](install-nodes.md) section.

If you already have Bitcoin/Lightning Node installed, you can skip to [Deploy Client](deploy-client.md) section.
{% endhint %}

## OS Setup

Once you've decided on a hardware/VPS and have login details. There's a bit of an infrastructure setup that's required to get the server production ready.

{% hint style="info" %}
Note that there are always many ways to accomplish tasks and each sysadmin can have their own preference for tools, scripts and automation. This guide follows basic principles to help entry-level users.
{% endhint %}

### Security

One of the most important things when running a live production system with funds on it is to keep it secure. By following common principles and best practices you can ensure you're protected from most hack attempts and at least make it difficult for bad actors to infiltrate your systems.

<details>

<summary>Disable Password Based Login</summary>

Generate ssh keys so that you can only login to your server with keys and never a clear-text password.

```
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

Add your public key to authorized\_keys on the server

```
echo 'public key from previous step' >> ~/.ssh/authorized_keys
```

Disable password based login on the server and restart sshd

```
vim /etc/ssh/sshd_config
PasswordAuthentication no

// once configuration is updated restart sshd
systemctl restart sshd
```

</details>

<details>

<summary>Install fail2ban</summary>

Fail2ban is a convenient access control daemon that can add bad actors that attack your system by brute forcing logins to a block list.

```
sudo apt-get install fail2ban
```

</details>

<details>

<summary>Setup Firewall</summary>

Your server should only have ports open that are crucial to the functioning of your nodes and your bridge.

```
sudo apt install ufw
```

Allow ports that are required for Bitcoin/Lightning/Stacks nodes and bridge app.

```
ufw allow ssh
ufw allow 8332
ufw allow 8333
ufw allow 9735
ufw allow 20443
ufw allow 20444
ufw allow 9002
ufw enable
```

</details>